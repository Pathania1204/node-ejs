import express from "express"
import dotenv from "dotenv"
import expressLayouts from "express-ejs-layouts"
import dbConnect from "./config/db.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
dotenv.config()

const app = express()
app.use(expressLayouts)
app.set("layout","layout")
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
dbConnect()

app.use("/users",userRoute)
app.use("/products",productRoute)

app.listen(8080,()=>{
 console.log("Server started")
})