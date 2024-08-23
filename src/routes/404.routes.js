import express from "express"
import apiError from "../utils/apiError.js"
const router = express.Router() 


router.route("*" , (req,res)=>{
    throw new apiError(404 , "Page not Found")
})

export default router