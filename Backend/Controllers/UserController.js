import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../Models/UserModel.js";
import userAuth from "../middlewares/auth.js";
const registerUser = async(req, res)=>{
    try{
        const{name, email, password} = req.body;

        if(!name || !email || !password){
            console.log( name, email, password)
            return res.json({success: false, message: "credentials not provided"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userData = {
            name,
            email, 
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        return res.json({success: true, token, user: {name: user.name}})
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User doesn't exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Wrong Credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        return res.json({success: true, token, user: {name : user.name}})
    }catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const userCredits= async(req, res)=>{
    try{
        const {userID}= await req.body

        const user = await userModel.findById(userID)

        if(!user){
            console.log(userID)
            return res.json({success: false, message: "User doesn't exists"})
        }

        return res.json({success:true, credits: user.creditBalance, user:{name: user.name}})
    }catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {registerUser, loginUser, userCredits}