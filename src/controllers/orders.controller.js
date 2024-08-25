import asyncHandler from "../utils/asyncHandler.js";
import Admin from "../models/admin.models.js";
import apiError from "../utils/apiError.js";
import dotenv from "dotenv"
dotenv.config()
import User from "../models/users.models.js";
import ApiResponse from "../utils/apiResponse.js";
import Products from "../models/Products.models.js";
import Order from "../models/orders.model.js";




const AddToCart = asyncHandler(async(req,res)=>{
    const user = req.user
    const address = user.address 
    const cart = user.cart
    const paymentMethod = user.paymentMethods
    const totalAmount = user.totalCartValue

    if(cart.length < 1){
        throw new apiError(400 , "cart is empty")
    }

    const order = await Order.create({
        user: user._id,
        cart: cart,
        address: address,
        status: 'Placed', 
        totalAmount: totalAmount,
        payment: [
           { cardNumber : paymentMethod.cardNumber} ,
           { cardName : paymentMethod.cardName}
        ]
    });

    user.cart = []
    user.totalCartValue = 0
    
    const user_orders = user.orders
    const newOrder = {
        orderId : order._id ,
        status : order.status
    }
    user_orders.push(newOrder)

    await user.save()

    res.status(200).json(new ApiResponse(200 , order , "Order Placed"))
})

const getOrder = asyncHandler(async(req,res)=>{
    const user = req.user
    const orders_from_user = user.orders

    const order_list = []
    if(orders_from_user.length > 0){
        for(var i = 0 ; i < orders_from_user.length ; i++){
            const particular_order = await Order.findById(orders_from_user[i].orderId).select("cart address status totalAmount")
            if(particular_order){
                order_list.push(particular_order)
            }
        }
    }

    res.status(200).json(new ApiResponse(200 , order_list , "Order list fetched"))
})

const getParticularOrder = asyncHandler(async(req,res)=>{
    const {id} = req.params
    if(!id){
        throw new apiError(400 , "no id present")
    }
    const order = await Order.findById(id)
    if(!order){
        throw new apiError(400 , "invalid id")
    }
    res.status(200).json(new ApiResponse(200 , order , "Order fetched"))
})

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json(new ApiResponse(400, null, "No ID present"));
    }

    const order = await Order.findByIdAndUpdate(id, { status: "Cancelled" });

    if (!order) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid ID"));
    }

    const user_From_jwt = req.user;
    let user = await User.findById(user_From_jwt._id);

    let otherOrders = [];
    for (let order of user.orders) {
        if (order.orderId.toString() === id) {
            otherOrders.push({ ...order._doc, status: "Cancelled" });
        } else {
            otherOrders.push(order);
        }
    }

    user.orders = otherOrders;

    await user.save();
    
    res.status(200).json(new ApiResponse(200, order, "Order cancelled successfully"));
});

export {AddToCart , getOrder , getParticularOrder , cancelOrder}