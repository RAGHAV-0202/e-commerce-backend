import express from "express";
import User from "../models/users.models.js"
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"
import nodeoutlook from "nodejs-nodemailer-outlook"
import jwt from  "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

async function generateAccessAndRefreshToken(userId){
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken() ;
        const refreshToken = user.generateRefreshToken() ;

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}
        
    }catch(Error){
        throw new apiError(500 , "Something went wrong while generating token")
    }
}

const UserLogin = asyncHandler(async(req,res)=>{
    const {login , password} = req.body
    if(!login?.trim() || !password?.trim()){
        throw new apiError(400 , "Both Fields are required");
    }

    const user = await User.findOne({$or : [{email : login} , {phoneNumber : login}]} , { refreshToken : 0})

    if(!user){
        throw new apiError(400 , "Invalid Login or Password")
    }

    const isPassValid = await user.isPasswordCorrect(password)

    if(!isPassValid){
        throw new apiError(400 , "Invalid Login or Password")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly : true ,
        secure : true,
        sameSite: 'None'
    }

    return res.status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , refreshToken , options)
        .json(
            new ApiResponse(200 , "Success" , "user logged in successfully")
        )
})


const UserRegister = asyncHandler(async(req,res)=>{
    const {firstName , lastName , email , phoneNumber , password} = req.body ;
    
    if(!firstName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim() ){
        throw new apiError(400 , "All Fields are required");
    }

    const ExistingUser = await User.findOne({
        $or: [
            { email: email.trim() },
            { phoneNumber: phoneNumber.trim() }
        ]
    });
    
    if(ExistingUser){
        throw new apiError(400 , "User Already exists")
    }

    
    const user = await User.create({
        firstName , lastName, email, phoneNumber, password
    })
    

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly : true ,
        secure : true,
        sameSite: 'None'
    }

    console.log("new user registered")
    return res.status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , refreshToken , options)
        .json(
            new ApiResponse(200 , {user : user , accessToken , refreshToken} , "user Registered successfully")
        )


})

const UserLogout = asyncHandler(async(req,res)=>{
    const options = {
        httpOnly : true , 
        secure : true
    }
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200 , "user logged out"))
})

const UserRefreshAccessToken = asyncHandler(async(req,res)=>{
    const oldRefreshToken = req.cookies.refreshToken

    if(!oldRefreshToken){
        throw new apiError(401 , "Unauthorized access , RAT")
    }

    const decoded = jwt.verify(oldRefreshToken , process.env.REFRESH_TOKEN_SECRET)
    
    const user = await User.findById(decoded._id).select("-password")

    if(!user){
        throw new apiError(401 , "Unauthorized access , RAT")
    }
    
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

    // console.log(accessToken) 

        
    const options = {
        httpOnly : true ,
        secure : true
    }

    res.status(200)
        .cookie("accessToken" , accessToken , options )
        .cookie("refreshToken" , refreshToken , options)
        .json(new ApiResponse(200 , {accessToken} , "refreshed token"))

})

const UserPasswordResetRequest = asyncHandler(async(req,res)=>{

    const {email} = req.body
    if(!email){
        throw new apiError("400" , "Enter Email")
    }
    const user = await User.findOne({email : email})
    
    if(!user){
        throw new apiError(400 , "user not registered")
    }

    const Token = jwt.sign(
        {_id : user._id},
        process.env.RESET_PASSWORD_SECRET , 
        {expiresIn : process.env.RESET_PASSWORD_EXPIRY}
    )
    user.resetToken = Token ;
    user.save();

    const link = `${process.env.BASE_URL}/api/auth/reset-password/${Token}`

    nodeoutlook.sendEmail({
    auth: {
        user: process.env.OUTLOOK_MAIL,
        pass: process.env.OUTLOOK_PASSWORD ,
    },
    from: process.env.OUTLOOK_MAIL,
    to: email,
    subject: 'Here is your Password Reset Link',
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #007bff;">Password Reset Request</h1>
                <p style="font-size: 16px; color: #333;">We received a request to reset your password. Click the button below to reset your password.</p>
                <a href="${link}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold; margin-top: 20px;">Reset Password</a>
                <p style="font-size: 14px; color: #555; margin-top: 20px;">If you did not request this password reset, please ignore this email.</p>
                <p style="font-size: 12px; color: #aaa; margin-top: 20px;">Don't share this link with anyone else. This link will expire in 15 minutes.</p>
            </div>
        </div>
    `,

    text: 'Expires in 15 minutes',
    replyTo: 'raghavkapoor16947@gmail.com',

    onError: (e) => console.log(e) ,
    onSuccess: (i) => res.status(200).json(new ApiResponse(200 , i.messageId ,"reset link sent successfully"))
}
);

})

const UserPasswordResetPage = asyncHandler(async(req,res)=>{
    const {token} = req.params
    if(!token){
        throw new apiError(400 , "no token present , Unauthorized Access")
    }

    const {password} = req.body
    if(!password){
        throw new apiError(400 , "Enter Password")
    }

    const decoded = jwt.verify(token , process.env.RESET_PASSWORD_SECRET)
    if(!decoded){
        throw new apiError(400 , "Token Expired or Invalid Token")
    }    

    const user = await User.findById(decoded?._id).select("-password -refreshToken")

    if(!user){
        throw new apiError(400 , "Invalid Token or Token Expired")
    }

    if(user.resetToken !== token){
        throw new apiError(400 , "Reset Link has been used !!!")
    }
    
    user.password = password
    user.resetToken = ""
    await user.save()

    res.status(200).json(new ApiResponse(200, "Password updated successfully"));

})





export {UserLogin , UserRegister,UserLogout,UserRefreshAccessToken , UserPasswordResetRequest,UserPasswordResetPage}