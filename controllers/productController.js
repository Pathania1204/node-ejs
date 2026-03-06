import productModel from "../models/productModel.js"
export const getProducts = async (req,res)=>{
 const products = await productModel.find()
 res.render("products/index",{products})
}
export const addProductPage = (req,res)=>{
 res.render("products/add")
}
export const saveProduct = async (req,res)=>{
 await productModel.create(req.body)
 res.redirect("/products")
}
export const editProductPage = async (req,res)=>{
 const product = await productModel.findById(req.params.id)
 res.render("products/edit",{product})
}
export const updateProduct = async (req,res)=>{
 await productModel.findByIdAndUpdate(req.params.id,req.body)
 res.redirect("/products")
}
export const deleteProduct = async (req,res)=>{
 await productModel.findByIdAndDelete(req.params.id)
 res.redirect("/products")
}