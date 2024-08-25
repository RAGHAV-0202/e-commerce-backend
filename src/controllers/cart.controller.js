import express from "express";
import User from "../models/users.models.js"
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"
import jwt from  "jsonwebtoken"
import dotenv from "dotenv"
import Products from "../models/Products.models.js";
dotenv.config()


const sendResponse = asyncHandler(async (req,res)=>{
    res.status(200).json(new ApiResponse(200 , req.url , "Cart route"))
})

const CartGetCart = asyncHandler(async(req,res)=>{
    const user = req.user
    let cart = user.cart
    let value = await user.calculateCartValue()

    res.status(200).json(new ApiResponse(200 , {cart , value}  , "User Cart fetched"))
})

const CartAddToCart = asyncHandler(async(req,res)=>{
    const user = req.user ;
    let cart = user.cart ;

    const {id} = req.params 
    if(!id){
        throw new apiError(400 , "Invalid Product , couldn't get id")
    }
    const product = await Products.findById(id)
    if(!product){
        throw new apiError(400 , "invalid id")
    }
    let isPresent = false ;
    let quantity = 1 ;
    

    user.cart.forEach((item) => {
        if (item.productId == id) {
            isPresent = true;
            quantity = item.quantity;
        }
    });

    if (isPresent) {
        user.cart = user.cart.map((item) =>
            item.productId == id ? { ...item, quantity: quantity + 1 } : item
        );
    } else {
        // console.log(product.title)
        user.cart.push({ productId: id, quantity: 1 , title : product.title , image : product.image[0].src , price : product.numericPrice});
    }

    await user.save();

    const newCart = await User.findById(user._id).select("-_id cart")

    return res.status(200).json(new ApiResponse(200 , newCart , "Added to cart"))

})

const CartUpdateQuantity = asyncHandler(async(req,res)=>{
    const { quantity} = req.body
    const {id} = req.params

    if(!id || !quantity){
        throw new apiError(400 , "Both Id and quantity are required")
    }
    const user = req.user
    let cart = user.cart 

    let updatedCart = cart.map((item)=>{
        if(item.productId == id){
            return {productId : id , quantity : quantity }
        }else{
            return item
        }
    })

    user.cart = updatedCart
    await user.save()

    return res.status(200).json(new ApiResponse(200 , updatedCart , "Added to cart"))


})


const CartDeleteFromCart = asyncHandler(async(req,res)=>{
    const user = req.user 
    const {id} = req.params

    if(!id){
        throw new apiError(400 , "No id present")
    }
    const cart = user.cart
    const itemIndex = cart.findIndex(item => item.productId == id);

    if (itemIndex === -1) {
        throw new apiError(404, "Product not found in cart");
    }
    cart.splice(itemIndex, 1);

    user.cart = cart;
    await user.save();

    const updatedCart = await User.findById(user._id).select("-_id cart");

    return res.status(200).json(new ApiResponse(200, updatedCart, "Product removed from cart"));    
    
})

const CartClearCart = asyncHandler(async(req,res)=>{
    const user = req.user
    user.cart = []
    await user.save()
    return res.status(200).json(new ApiResponse(200 , [] , "Cart Cleared"))
})

const CartCalculateCartValue = asyncHandler(async(req,res)=>{
    const user = req.user
    // const value = await user.calculateCartValue ()
    // console.log(value)
    value = user.cart.cartValue
    res.status(200).json(new ApiResponse(200 , value , "cart value fetched"))
})


export {sendResponse , CartGetCart , CartAddToCart , CartUpdateQuantity ,CartDeleteFromCart , CartClearCart , CartCalculateCartValue}