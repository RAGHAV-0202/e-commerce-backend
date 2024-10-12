import asyncHandler from "../utils/asyncHandler.js";
import Admin from "../models/admin.models.js";
import apiError from "../utils/apiError.js";
import dotenv from "dotenv"
dotenv.config()
import User from "../models/users.models.js";
import ApiResponse from "../utils/apiResponse.js";
import Products from "../models/Products.models.js";
import Order from "../models/orders.model.js";

async function generateAccessToken(userId){
    try{
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken() ;

        return {accessToken}
        
    }catch(Error){
        throw new apiError(500 , "Something went wrong while generating token")
    }
}


const adminLogin = asyncHandler(async(req,res)=>{
    const {email , password} = req.body 
    if(!email || !password ){
        throw new apiError(400 , "enter email and passoword")
    }
    const admin = await Admin.findOne({email : email})
    console.log(admin)

    if(!admin){
        throw new apiError(400 , "Invalid Login or Password , admin not found")
    }
    const isPassValid = password == admin.password
    if(!isPassValid){
        throw new apiError(400 , "Invalid Login or Password")
    }
    const {accessToken} = await generateAccessToken(admin._id);

    const options = {
        httpOnly : true ,
        secure : true,
        sameSite: 'None'
    }

    return res.status(200)
        .cookie("accessToken" , accessToken , options)
        .json(
            new ApiResponse(200 , {id : admin._id} , "Welcome Admin")
        )    

})

const AdminGetAllUsers = asyncHandler(async (req,res)=>{
    const users = await User.find().select("firstName email")
    res.status(200).json(new ApiResponse(200 , users , "All users fetched"))
})

const AdminGetUser = asyncHandler(async (req,res)=>{
    const {id} = req.params
    if(!id){
        throw new apiError(400 , "no id present in the url")
    }
    const user = await User.findById(id)
    console.log(user)
    res.status(200).json(new ApiResponse(200 , user , "user fetched"))
})

const AdminDeleteUser = asyncHandler(async (req,res)=>{
    const {id} = req.params
    if(!id){
        throw new apiError(400 , "no id present in the url")
    }
    const user = await User.findByIdAndDelete(id)
    res.status(200).json(new ApiResponse(200 , user , "User Deleted"))
})

const AdminAddProduct = asyncHandler(async(req,res)=>{
    const {articleCode , title , category , image , price , sellingAttribute , swatches , brandName , broadCategory} = req.body
    if(!articleCode || !title || !category || !broadCategory || !price){
        throw new apiError(400 , "All fields are required")
    }
    const product = await Products.create({
        articleCode , title , category , image , price , sellingAttribute , swatches , brandName , broadCategory
    })

// {
//     "articleCode" : "",
//     "title" : "",
//     "category" : "" , 
//     "image" :  [
//         {
//             "src" : "" , 
//             "dataAltImage" : "" , 
//             "alt" : "" ,
//             "dataAltText" : ""
//         }
//     ] , 
//     "price" : "" , 
//     "sellingAttribute" : "" , 
//     "swatches" :  [
//         {
//             "colorCode" : "" ,
//             "colorName" : "" 
//         }
//     ], 
//     "brandName" : "" , 
//     "broadCategory" : "" 
// }

    // console.log(product)
    res.status(200).json(new ApiResponse(200 , product , "Product Created Successfully"))
})

const AdminEditProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
        throw new apiError(400, "Product ID is required");
    }

    const product = await Products.findById(id);

    if (!product) {
        throw new apiError(404, "Product not found");
    }

    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
            product[key] = updates[key];
        }
    });

    const updatedProduct = await product.save();

    res.status(200).json(new ApiResponse(200, updatedProduct, "Product Updated Successfully"));
});

const AdminDeleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params 
    if(!id){
        throw new apiError(400 , "Id is required")
    }

    const deletedProduct = await Products.findByIdAndDelete(id) ;
    if(!deletedProduct){
        throw new apiError(400 , "invalid id , no product found")
    }
    res.status(200).json(new ApiResponse(200 , deletedProduct , "Product deleted Successfully"))
})

const AdminGetOrders = asyncHandler(async(req,res)=>{
    const Orders = await Order.find()
    res.status(200).json(new ApiResponse(200 , Orders , "All Orders Fetched"))
})

const AdminUpdateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  const order = await Order.findById(id).select("status user");
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }

  order.status = newStatus;

  let user = await User.findById(order.user);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  let updatedOrders = [];
  for (let userOrder of user.orders) {
    if (userOrder && userOrder.orderId) {
      if (userOrder.orderId.toString() === id) {
        updatedOrders.push({ ...userOrder._doc, status: newStatus });
      } else {
        updatedOrders.push(userOrder);
      }
    } else {
      console.warn('Invalid order found in user.orders:', userOrder);
      // Optionally, you can choose to keep or skip invalid orders
      // updatedOrders.push(userOrder);
    }
  }

  user.orders = updatedOrders;

  await order.save();
  await user.save();

  res.status(200).json(new ApiResponse(200, newStatus, "Order status updated successfully"));
});

export {AdminGetAllUsers , adminLogin ,AdminGetUser , AdminDeleteUser , AdminAddProduct ,AdminEditProduct , AdminDeleteProduct , AdminGetOrders , AdminUpdateStatus}