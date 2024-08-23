import express from "express";
import User from "../models/users.models.js"
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"
import jwt from  "jsonwebtoken"
import dotenv from "dotenv"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
dotenv.config()

const UserProfile = asyncHandler(async(req,res)=>{
    const user = req.user

    if (!user) {
 return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }

    const {firstName, lastName, phoneNumber, email, address, profilePicture, dob, cart, paymentMethods} = user
    res.status(200).json(new ApiResponse(200 , {firstName, lastName, phoneNumber, email, address, profilePicture, dob, cart, paymentMethods} , "user profile fetched"))
})

const UserUpdateFirstName = asyncHandler(async(req,res)=>{
    const user = req.user

    if (!user) {
    return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const {firstName} = req.body
    if(!firstName){
        throw new apiError (400 , "Enter first name")
    }
    user.firstName = firstName ;
    await user.save()
    res.status(200).json(new ApiResponse(200 , firstName , "Firstname changed successfully"))
})

const UserUpdateLastName = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const { lastName } = req.body;
    if (!lastName) {
        throw new apiError(400, "Enter last name");
    }
    user.lastName = lastName;
    await user.save();
    res.status(200).json(new ApiResponse(200, lastName, "Last name changed successfully"));
});

const UserUpdatePhoneNumber = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        throw new apiError(400, "Enter phone number");
    }
    user.phoneNumber = phoneNumber;
    await user.save();
    res.status(200).json(new ApiResponse(200, phoneNumber, "Phone number changed successfully"));
});

const UserUpdateEmail = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const { email } = req.body;
    if (!email) {
        throw new apiError(400, "Enter email");
    }
    // Validate new email format and uniqueness
    user.email = email;
    await user.save();
    res.status(200).json(new ApiResponse(200, email, "Email changed successfully"));
});

const UserUpdateAddress = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const { address } = req.body;
    if (!address || !address.fullName || !address.phone || !address.streetAddress || !address.city || !address.state || !address.postalCode || !address.country) {
        throw new apiError(400, "Enter complete address details");
    }
    user.address = [address];
    await user.save();
    res.status(200).json(new ApiResponse(200, address, "Address changed successfully"));
});

const UserUpdateDOB = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const { dob } = req.body;
    if (!dob) {
        throw new apiError(400, "Enter date of birth");
    }
    user.dob = dob;
    await user.save();
    res.status(200).json(new ApiResponse(200, dob, "Date of birth changed successfully"));
});

const UserUpdatePaymentMethods = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }
    const { paymentMethods } = req.body;
    if (!paymentMethods || !Array.isArray(paymentMethods)) {
        throw new apiError(400, "Enter valid payment methods");
    }
    user.paymentMethods = paymentMethods;
    await user.save();
    res.status(200).json(new ApiResponse(200, paymentMethods, "Payment methods updated successfully"));
});

const UserUpdateProfilePicture = asyncHandler(async(req,res)=>{
    const user = req.user;

    if (!user) {
        return res.status(401).json(new apiError(401, null, "User not authenticated"));
    }

    let avatarLocalPath = ""
    const obj_avatar = (req.files?.avatar[0])
    avatarLocalPath = obj_avatar.path

    if(avatarLocalPath == ""){
        throw new apiError(400 , "avatar local path is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if(!avatar){
        throw new apiError(400 , "avatar cloudinary is required")
    }

    user.profilePicture = avatar.url 
    await user.save()

    res.status(200).json(new ApiResponse(200 , avatar.url , "profile picture updated successfuly"))

})

export {UserProfile, UserUpdateFirstName, UserUpdateLastName, UserUpdatePhoneNumber, UserUpdateEmail, UserUpdateAddress, UserUpdateDOB, UserUpdatePaymentMethods ,UserUpdateProfilePicture}