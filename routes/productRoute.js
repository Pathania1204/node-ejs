import express from "express"

import {
 getProducts,
 addProductPage,
 saveProduct,
 editProductPage,
 updateProduct,
 deleteProduct
} from "../controllers/productController.js"

const router = express.Router()

router.get("/",getProducts)
router.get("/add",addProductPage)
router.post("/save",saveProduct)
router.get("/:id/edit",editProductPage)
router.post("/:id/update",updateProduct)
router.get("/:id/delete",deleteProduct)

export default router