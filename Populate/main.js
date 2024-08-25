import mongoose from "mongoose";
import { Products } from "../src/models/Products.models.js";

// Import your product data
// import data from "../src/data/data.js"

import dotenv from "dotenv"
dotenv.config()





// Change Broad Category first




const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await Products.insertMany(data);
    console.log('Data Imported!');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

const run = async () => {
  await connectDB();
  await importData();
};

run();
