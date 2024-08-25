import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User reference is required"]
    },
    cart: [
        {
        productId: {
            type: String,
            // ref: 'Product',
            requried : [true , "product id is required"]
        },
        quantity: {
            type: Number,
            default: 1,
        },
          cartValue : {
          type : Number
        },
        title : {
            type : String
        },
        image :{
            type : String
        } , 
        price :{
            type : Number
        }
        },
    ],
    address : [
        {
            fullName: { type: String , required : [true , "all fields are required"]},
            phone: { type: String , required : [true , "all fields are required"]},
            streetAddress: { type: String , required : [true , "all fields are required"]},
            city: { type: String , required : [true , "all fields are required"]},
            state: { type: String , required : [true , "all fields are required"]},
            postalCode: { type: String , required : [true , "all fields are required"]},
            country: { type: String , required : [true , "all fields are required"]},
        }
    ],
    status : {
        type : String,
        enum : ["Placed" , "Processing" , "Confirmed" , "Shipped" , "Out for Delivery" , "Delivered" , "Canceled" , "Refunded" , "Returned" , "Completed"],
        default : "Placed"
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"]
    },
    paymentMethods: [
        {
        cardName: { type: String },
        cardNumber: { type: String }
        },
  ],
}  , {timestamps : true})


const Order = mongoose.model("Order", OrderSchema);
export default Order;