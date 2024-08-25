import Products from "../models/Products.models.js"
import apiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const AddReview = asyncHandler(async(req,res)=>{
    const user = req.user

    const {title , description} = req.body
    const {id} = req.params

    if(!title || !description || !id){
        throw new apiError(400 , "Title, Description or product id is missing")
    }
    const product = await Products.findById(id)
    if(!product){
         throw new apiError(400 , "Invalid id")
    }
    let reviews = product.reviews
    const newReview = {
        title : title , 
        description : description ,
        owner : user._id
    }
    reviews = [...reviews , newReview]
    product.reviews = reviews
    await product.save()

    const updatedReviews = await Products.findById(id).select("-_id reviews")

    res.status(200).json(new ApiResponse(200 , updatedReviews , "Reviews"))
})

const getReviews = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const reviews = await Products.findById(id).select("-_id reviews")

    res.status(200).json(new ApiResponse(200 , reviews , "Reviews"))
})

const deleteReview = asyncHandler(async (req, res) => {
    const user = req.user;
    const { productId, reviewId } = req.params;

    if (!productId || !reviewId) {
        throw new apiError(400, "Product id or review id is missing");
    }

    const product = await Products.findById(productId);
    if (!product) {
        throw new apiError(400, "Invalid product id");
    }

    const reviewIndex = product.reviews.findIndex(review => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
        throw new apiError(400, "Review not found");
    }

    if (product.reviews[reviewIndex].owner.toString() !== user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this review");
    }

    product.reviews.splice(reviewIndex, 1);

    await product.save();

    res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});




export {AddReview , getReviews  , deleteReview }