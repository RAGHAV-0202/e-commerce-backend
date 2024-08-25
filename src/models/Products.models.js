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
  numericPrice : {
    type : Number
  },
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
  },reviews : [
    {
      title : {
        type : String ,
        required : [true , "Title for review is required"]
      },
      description : {
        type : String , 
        required : [true , "Title for review is required"],
        minlength : [10 , "minimum 10 characters are required"]
      },
      owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      }
    }
  ]
} , {timestamps : true});

productSchema.pre('save', function (next) {
  const priceString = this.price;
  if (priceString) {
    const numericPrice = parseFloat(priceString.replace("Rs.", "").replace(/,/g, ""));
    this.numericPrice = numericPrice;
  }
  next();
});

const Products = mongoose.model("Products" , productSchema)

export default Products