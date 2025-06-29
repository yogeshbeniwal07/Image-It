import express from 'express'
import { loginUser, registerUser, userCredits } from '../Controllers/UserController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post("/signUp", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/credits", userAuth, userCredits)

export default userRouter;