import express from "express"
import { MenProducts,LadiesProducts,SportsProducts,newArrivalProducts,KidsProducts,HomeProducts,BabyProducts  , AllProducts , getProduct ,searchProduct} from "../controllers/products.controllers.js"
const router = express.Router()


router.route("/men").get(MenProducts)
router.route("/ladies").get(LadiesProducts)
router.route("/sports").get(SportsProducts)
router.route("/new-arrival").get(newArrivalProducts)
router.route("/kids").get(KidsProducts)
router.route("/home").get(HomeProducts)
router.route("/baby").get(BabyProducts)
router.route("/all-products").get(AllProducts)
router.route("/item/:id").get(getProduct)
router.route("/search/:query").get(searchProduct)

// router.route("/status").get(status)

router.route("/not-found").get((req,res)=>{
    res.send("not found")
})


 

export default router