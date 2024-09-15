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

} , {timestamps : true})


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
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



const User = mongoose.model("User" , UserSchema)
export default User