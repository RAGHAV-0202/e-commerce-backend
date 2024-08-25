import express from "express"
import { VerifyJWT } from "../middlewares/auth.middleware.js"
import {AddReview , getReviews  , deleteReview } from "../controllers/reviews.controllers.js"
const router = express.Router()


router.route("/add/:id").post(VerifyJWT , AddReview)
router.route("/getAll/:id").get(getReviews)
router.route("/delete/:id").post(VerifyJWT , deleteReview)



export default router 
