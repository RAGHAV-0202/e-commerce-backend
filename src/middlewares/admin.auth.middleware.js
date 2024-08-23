import jwt from "jsonwebtoken"
import express from "express"
import asyncHandler from "../utils/asyncHandler.js"
import Admin from "../models/admin.models.js"
import apiError from "../utils/apiError.js"
import dotenv from "dotenv"
dotenv.config()

export const VerifyAdminJWT = asyncHandler(async(req,res,next)=>{
    const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer " , "")

    if(!accessToken){
        throw new apiError(403 , "No accessToken present , Unauthorized access")
    }
    const decodedToken = jwt.verify(accessToken , process.env.ADMIN_ACCESS_TOKEN_SECRET)
    if(!decodedToken){
         throw new apiError(403 , "Invalid accessToken present , Unauthorized access")
    }

    const user = await Admin.findById(decodedToken?._id)
    
    if(!user){
        throw new apiError(403 , "Invalid accessToken present , Unauthorized access")
    }

    req.user = user
    next()
})
