import express from "express"
import User from "../models/users.models.js"
import ApiResponse from "../utils/apiResponse.js"
import { VerifyJWT } from "../middlewares/auth.middleware.js"
import { sendResponse , CartGetCart , CartAddToCart , CartUpdateQuantity ,CartDeleteFromCart ,CartClearCart , CartCalculateCartValue} from "../controllers/cart.controller.js"
const router = express.Router()


router.route("/get-cart").get(VerifyJWT , CartGetCart)
router.route("/add-to-cart/:id").post(VerifyJWT,CartAddToCart)
router.route("/quantity/:id").post(VerifyJWT , CartUpdateQuantity)
router.route("/remove/:id").post(VerifyJWT , CartDeleteFromCart)
router.route("/clear-cart").post(VerifyJWT , CartClearCart)
router.route("/value").get(VerifyJWT , CartCalculateCartValue)

export default router

 