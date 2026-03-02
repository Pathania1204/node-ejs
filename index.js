import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import expressLayouts from "express-ejs-layouts";
import bcrypt from "bcryptjs"
const app = express();
app.use(expressLayouts)
app.set("layout","layout")
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();  
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
app.listen(8080, () => {
  console.log("Server started");
});
app.get("/users/signup",(req,res)=>{
  res.render("users/signup");
});
app.get("/users/signin",(req,res)=>{
  res.render("users/signin");
});
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
app.post("/users/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await userModel.create({
    name,
    email,
    password: hash,
    role,
  });
  res.json({ message: "Signup Success" });
});

app.post("/users/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.json({ message: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });
  res.json({ message: "Login Success" });
});
app.post("/users/saveuser", async (req, res) => {
  await userModel.create(req.body);
  res.redirect("/users");
});
app.post("/users/checkuser", async (req, res) => {
  const { email, password } = req.body;
  const found = await userModel.findOne({ email });
  if (!found) {
    return res.send("User not found");
  }
  const chkPassword = await bcrypt.compare(
    password,
    found.password
  );
  if (chkPassword) {
    res.redirect("/");
  } else {
    res.send("Wrong Password");
  }

});