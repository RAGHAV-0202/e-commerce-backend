import express from "express"
import { VerifyJWT } from "../middlewares/auth.middleware.js"
import {UserProfile,UserUpdateFirstName, UserUpdateLastName, UserUpdatePhoneNumber, UserUpdateEmail, UserUpdateAddress, UserUpdateDOB, UserUpdatePaymentMethods , UserUpdateProfilePicture} from "../controllers/userMgmt.controllers.js"
const router = express.Router()
import upload from "../middlewares/multer.middleware.js"

router.route("/profile").get(VerifyJWT , UserProfile)

router.route("/profile/update-firstname")   .post(VerifyJWT, UserUpdateFirstName);
router.route("/profile/update-lastname")    .post(VerifyJWT, UserUpdateLastName);
router.route("/profile/update-phonenumber") .post(VerifyJWT, UserUpdatePhoneNumber);
router.route("/profile/update-email")       .post(VerifyJWT, UserUpdateEmail);
router.route("/profile/update-address")     .post(VerifyJWT, UserUpdateAddress);
router.route("/profile/update-dob")         .post(VerifyJWT, UserUpdateDOB);
router.route("/profile/update-payment-methods").post(VerifyJWT, UserUpdatePaymentMethods);
router.route("/profile/update-profile-picture").post(VerifyJWT, upload.fields([{ name: "avatar", maxCount: 1 }]), UserUpdateProfilePicture);




export default router