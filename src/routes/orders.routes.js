import express from "express"
import { VerifyJWT } from "../middlewares/auth.middleware.js"
import { AddToCart  , getOrder , getParticularOrder , cancelOrder} from "../controllers/orders.controller.js"
const router = express.Router()


router.route("/place").post(VerifyJWT , AddToCart)
router.route("/get-orders").post(VerifyJWT , getOrder)
router.route("/get-order/:id").post(VerifyJWT , getParticularOrder)
router.route("/cancel/:id").post(VerifyJWT , cancelOrder)


export default router 
