import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Products from "./Products.models.js";

const UserSchema = new mongoose.Schema({

    firstName : {
        type : String ,
        requried : [true , "first name is required"]
    },
    lastName : {
        type : String , 
        // required : [true , "lastname is required"]
        default : "N/A"
    },
    email : {
        type : String , 
        required : [true , "email is required"],
        unique : [true , "email already in use"]
    },
    phoneNumber : {
        type : String , 
        required : [true , "phone number is required"],
        unique : [true , "phone number already in use"]
    },
    password : {
        type : String , 
        required : [true , "Password is required"] ,
        minlength : 6 , 
    },
    isAdmin : {
        type : Boolean ,
        default : false
    },
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
    wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      status: { 
        type: String, 
        enum:  ["Placed" , "Processing" , "Confirmed" , "Shipped" , "Out for Delivery" , "Delivered" , "Cancelled" , "Refunded" , "Returned" , "Completed"],
      }
    },
  ],
  paymentMethods: [
    {
      cardName: { type: String },
      cardNumber: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
    },
  ],
  refreshToken : {
    type : String
  },
  resetToken : {
    type : String
  },
  profilePicture : {
    type : String ,
    default : "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
  },
  dob : {
    type : String ,
    default : "01/01/2001"
  },
  totalCartValue: {
        type: Number,
        default: 0
  },
} , {timestamps : true})


UserSchema.pre("save", async function (next) {
    console.log("Original password: ", this.password);
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    console.log("Hashed password: ", this.password);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    console.log("line 128 from model " + password , this.password)
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username, fullName: this.fullName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

UserSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        { _id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}
UserSchema.methods.calculateCartValue = async function () {
    const cartItems = this.cart;
    let totalValue = 0;

    for (const item of cartItems) {
        const product = await Products.findById(item.productId).exec();
        if (product) {
            totalValue += product.numericPrice * item.quantity;
        }
    }

    return totalValue;
};

UserSchema.pre("save", async function (next) {
    if (this.isModified("cart")) {
        let totalCartValue = 0;

        // Calculate the total cart value and update each item's cartValue
        const cartUpdates = this.cart.map(async item => {
            const product = await Products.findById(item.productId).exec();
            if (product) {
                const itemCartValue = product.numericPrice * item.quantity;
                totalCartValue += itemCartValue;

                return {
                    ...item.toObject(),
                    cartValue: itemCartValue
                };
            }
            return item;
        });

        this.cart = await Promise.all(cartUpdates);
        this.totalCartValue = totalCartValue;
    }

    next();
});

const User = mongoose.model("User" , UserSchema)
export default User