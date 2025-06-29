import jwt from "jsonwebtoken"
import express from 'express';
const app = express();
app.use(express.json());

const userAuth = async(req, res, next) =>{
    const {token} = req.headers;

    if(!token){
        return res.json({success: false, message:"Not Authorised, Login Again"})
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (!req.body) req.body = {};

        if(tokenDecode.id){
            req.body.userID = tokenDecode.id;
        }
        else{
            return res.json({success: false, message:"Not authorised"})
        }

        next();
    }catch(error){
        console.log(error)
        res.json({success: false, message:error.message})
    }
}

export default userAuth