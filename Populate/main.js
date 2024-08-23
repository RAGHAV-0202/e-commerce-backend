import mongoose from "mongoose";
import { Products } from "../src/models/Products.models.js";

// Import your product data
// import data from "../src/data/data.js"







// Change Broad Category first




const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://raghavkapoor16947:raghavHM@h-m.jkpod.mongodb.net/H-M', {
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
