import express, { Router } from "express"
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
dotenv.config()
import dataRouter from "./routes/data.routes.js"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/userMgmt.routes.js"
import asyncHandler from "./utils/asyncHandler.js";
import adminRouter from "./routes/admin.routes.js"
import ApiResponse from "./utils/apiResponse.js";
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/orders.routes.js"
import reviewRouter from "./routes/reviews.routes.js"
const app = express();


app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


const corsOptions = {
    origin: ['https://h-m-clone.netlify.app', 'http://localhost:3000' , "http://172.20.10.2:3000" , "http://192.168.29.76:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true ,
    sameSite: 'None'
};

app.use(cors(corsOptions));

async function getStats(){
  const startTime = Date.now();
  const result = await mongoose.connection.db.command({ ping: 1 });
  const endTime = Date.now();
  const latency = endTime - startTime;

  const isMongoConnected = mongoose.connection.readyState === 1;
  const statusInfo = {
    status: "OK",
    mongoDB: isMongoConnected ? "Connected" : "Disconnected",
    latency: latency + "ms",
    timestamp: new Date(),
  };
  return statusInfo
}

app.get(/\/.*\/status$/, asyncHandler(async (req, res) => {
  const statusInfo = await getStats()
  res.status(200).json(statusInfo);
}));


app.get("/" , async(req,res)=>{
  const statusInfo = await getStats()
  res.status(200).json(new ApiResponse(200 , statusInfo , "Server is live"))
})

app.use("/api/products/data" , dataRouter )
app.use("/api/auth" , authRouter )
app.use("/api/user" , userRouter)
app.use("/api/admin" , adminRouter)
app.use("/api/cart" , cartRouter)
app.use("/api/orders" , orderRouter)
app.use("/api/reviews" , reviewRouter)


app.get("*" , (req,res)=>{
    res.status(404).send(`
        <body style="display: flex; align-items: center; justify-content: center; min-height: 100vh; min-width: 100vw; box-sizing : border-box">
            <h1>Resource not found <br> Status Code 404</h1>
        </body>
    `)
})


export {app}