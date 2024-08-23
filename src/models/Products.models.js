import mongoose from "mongoose";


const imageSchema = new mongoose.Schema({
  src: String,
  dataAltImage: String,
  alt: String,
  dataAltText: String,
});

const swatchSchema = new mongoose.Schema({
  colorCode: String,
  articleLink: String,
  colorName: String,
});

const productSchema = new mongoose.Schema({
  articleCode: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // Store the category as it is
  image: [imageSchema],
  price: { type: String, required: true },
  sellingAttribute: String,
  swatches: [swatchSchema],
  brandName: {
    type : String , 
    default : "H&M"
  },
  broadCategory : {
    type : String ,
    // default : "Baby"
    required : [true  , "provide broad category"]
  }
} , {timestamps : true});


const Products = mongoose.model("Products" , productSchema)

export default Products