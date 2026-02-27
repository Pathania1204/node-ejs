import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

/* ===== PATH FIX ===== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/* ===== MIDDLEWARE ===== */

app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ===== DB CONNECTION ===== */

const dbConnect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  }
};

app.use(async (req, res, next) => {
  await dbConnect();
  next();
});

/* ===== SCHEMAS ===== */

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageurl: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

const productModel = mongoose.model("products", productSchema);
const userModel = mongoose.model("users", userSchema);

/* ===== ROUTES ===== */

app.get("/", (req, res) => {
  res.redirect("/products");
});

/* PRODUCTS */

app.get("/products", async (req, res) => {
  const products = await productModel.find();
  res.render("products/index", { products });
});

app.get("/products/add", (req, res) =>
  res.render("products/add")
);

app.post("/products/save", async (req, res) => {
  await productModel.create(req.body);
  res.redirect("/products");
});

app.get("/products/:id/edit", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.render("products/edit", { product });
});

app.post("/products/:id/update", async (req, res) => {
  await productModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/products");
});

app.get("/products/:id/delete", async (req, res) => {
  await productModel.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

/* USERS */

app.get("/users", async (req, res) => {
  const users = await userModel.find();
  res.render("users/index", { users });
});

app.get("/users/add", (req, res) =>
  res.render("users/add")
);

app.post("/users/save", async (req, res) => {
  await userModel.create(req.body);
  res.redirect("/users");
});

app.get("/users/:id/edit", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render("users/edit", { user });
});

app.post("/users/:id/update", async (req, res) => {
  await userModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/users");
});

app.get("/users/:id/delete", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect("/users");
});

/* ===== EXPORT FOR VERCEL ===== */

export default serverless(app);