import express from "express"
import {
  signupPage,
  signinPage,
  getUsers,
  addUserPage,
  saveUser
} from "../controllers/userController.js"

const router = express.Router()

router.get("/", getUsers)
router.get("/signup", signupPage)
router.get("/signin", signinPage)
router.get("/add", addUserPage)  
router.post("/save", saveUser)
export default router