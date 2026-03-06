import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"

export const signupPage = (req,res)=>{
 res.render("users/signup")
}
export const addUserPage = (req,res)=>{
  res.render("users/add")
}
export const signinPage = (req,res)=>{
 res.render("users/signin")
}
export const saveUser = async (req,res)=>{
  await userModel.create(req.body)
  res.redirect("/users")
}
export const signup = async (req,res)=>{
 const {name,email,password,role} = req.body
 const hash = await bcrypt.hash(password,10)

 await userModel.create({
  name,
  email,
  password:hash,
  role
 })

 res.json({message:"Signup Success"})
}

export const signin = async (req,res)=>{
 const {email,password} = req.body

 const user = await userModel.findOne({email})

 if(!user) return res.json({message:"User not found"})

 const match = await bcrypt.compare(password,user.password)

 if(!match) return res.json({message:"Wrong password"})

 res.json({message:"Login Success"})
}

export const getUsers = async (req,res)=>{
 const users = await userModel.find()
 res.render("users/index",{users})
}