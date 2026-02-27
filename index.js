import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
const app = express();
app.use(expressLayouts)
app.set("layout","layout")
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();  
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
const startServer = async () => {
  await dbConnect();
  app.listen(8080, () => console.log("Server started"));
};
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true , unique:true},
  password: { type: String, required: true },
  role: { type: String, required: true },
});
const productModel = mongoose.model("products", productSchema);
const userModel = mongoose.model("users", userSchema);
app.get("/products", async (req,res)=>{
  const products = await productModel.find()
  res.render("products/index",{products})
}); 
app.get("/products/add",(req,res)=>{
  res.render("products/add")
})
app.post("/products/save", async (req,res)=>{
  await productModel.create(req.body)
  res.redirect("/products")
})
app.get("/products/:id/edit", async (req,res)=>{
  const product = await productModel.findById(req.params.id)
  res.render("products/edit",{product})
})
app.post("/products/:id/update", async (req,res)=>{
  await productModel.findByIdAndUpdate(req.params.id, req.body)
  res.redirect("/products")
})
app.get("/products/:id/delete", async (req,res)=>{
  await productModel.findByIdAndDelete(req.params.id)
  res.redirect("/products")
})

// USERS
app.get("/users", async (req,res)=>{
  const users = await userModel.find()
  res.render("users/index",{users})
})
app.get("/users/add",(req,res)=>{
  res.render("users/add")
})
app.post("/users/save", async (req,res)=>{
  await userModel.create(req.body)
  res.redirect("/users")
})
app.get("/users/:id/edit", async (req,res)=>{
  const user = await userModel.findById(req.params.id)
  res.render("users/edit",{user})
})
app.post("/users/:id/update", async (req,res)=>{
  await userModel.findByIdAndUpdate(req.params.id, req.body)
  res.redirect("/users")
})
app.get("/users/:id/delete", async (req,res)=>{
  await userModel.findByIdAndDelete(req.params.id)
  res.redirect("/users")
})

startServer();