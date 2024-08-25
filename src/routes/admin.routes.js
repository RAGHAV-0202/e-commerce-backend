import express from "express"
import { VerifyAdminJWT } from "../middlewares/admin.auth.middleware.js"
const router = express.Router()
import {AdminGetAllUsers , adminLogin ,AdminGetUser , AdminDeleteUser , AdminAddProduct , AdminEditProduct , AdminDeleteProduct , AdminGetOrders , AdminUpdateStatus} from "../controllers/admin.controllers.js"
 

router.route("/login").post(adminLogin)
router.route("/get-all-users").get(VerifyAdminJWT,AdminGetAllUsers)
router.route("/get-user/:id").get(VerifyAdminJWT,AdminGetUser)
router.route("/delete-user/:id").post(VerifyAdminJWT,AdminDeleteUser)

router.route("/add-product").post(VerifyAdminJWT,AdminAddProduct)
router.route("/edit-product/:id").post(VerifyAdminJWT,AdminEditProduct)
router.route("/delete-product/:id").post(VerifyAdminJWT , AdminDeleteProduct)

router.route("/get-orders").get(VerifyAdminJWT , AdminGetOrders)
router.route("/edit-status/:id").post(VerifyAdminJWT , AdminUpdateStatus)

export default router