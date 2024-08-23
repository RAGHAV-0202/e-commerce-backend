import  asyncHandler from "../utils/asyncHandler.js"
import Products from  "../models/Products.models.js"
import apiError from "../utils/apiError.js"
import mongoose from "mongoose"
import ApiResponse from "../utils/apiResponse.js"

const MenProducts =  asyncHandler(async(req,res)=>{

    const page = req.query.page || 1
    //.skip((page - 1) * 25).limit(25).exec()
    const data = await Products.find({broadCategory : "Men"}).skip((page - 1) * 25).limit(1000).exec()
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))
})

const LadiesProducts =  asyncHandler(async(req,res)=>{
    const page = req.query.page || 1
    //.skip((page - 1) * 25).limit(25).exec()
    const data = await Products.find({broadCategory : "Ladies"})
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))
})

const SportsProducts =  asyncHandler(async(req,res)=>{
    const page = req.query.page || 1
    const data = await Products.find({broadCategory : "Sports"})
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))
})

const newArrivalProducts =  asyncHandler(async(req,res)=>{
    const page = req.query.page || 1
    const data = await Products.find({broadCategory : "newArrival"})
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))
})

const KidsProducts = asyncHandler(async(req,res)=>{
    const page = req.query.page || 1
    const data = await Products.find({broadCategory : "Kids"})
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))

})

const HomeProducts =  asyncHandler(async(req,res)=>{
    const page = req.query.page || 1
    const data = await Products.find({broadCategory : "Home"})
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))

})

const BabyProducts = asyncHandler(async(req,res)=>{
    const page = req.query.page || 1
    const data = await Products.find({broadCategory : "Baby"})
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))

})

const AllProducts =  asyncHandler(async(req,res)=>{
    const data = await Products.find()
    return res.status(200).json(new ApiResponse(200 , data , "Fetched data"))

})

const getProduct =  asyncHandler(async(req ,res)=>{
    const {id} = req.params
    const product = await Products.findById(id)

    if(!product){
        throw new apiError(401 , "Product not found ; Invalid Id")
    }
    return res.status(200).json(new ApiResponse(200 , product , "Fetched data"))
})

const searchProduct = asyncHandler(async(req,res)=>{
    const {query} = req.params
    console.log(query)

    if (!query) {
        throw new apiError(400, "Search query is required");
    }

    const regex = new RegExp(query, 'i');


    const page = req.query.page || 1

    const products = await Products.find({
        $or: [
            { title: { $regex: regex } },
            { category: { $regex: regex } },
            { brandName: { $regex: regex } },
            { broadCategory: { $regex: regex } },
            { sellingAttribute: { $regex: regex } },
            { "swatches.colorName": { $regex: regex } }
        ]
    });

    if (products.length === 0) {
        throw new apiError(404, "No products found matching your query");
    }

    res.status(200).json(new ApiResponse(200, products, "Search Results"));
})




export {MenProducts,LadiesProducts,SportsProducts,newArrivalProducts,KidsProducts,HomeProducts,BabyProducts,AllProducts , getProduct ,searchProduct}