import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import { sendWelcomeEmail } from "../middleware/nodemailer.middleware.js";

//generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email, id: user._id}, process.env.ACCESS_TOKEN, { expiresIn: '6h' });
};


//generate refresh token
const generateRefreshToken = (user)=>{
    return jwt.sign({email:user.email},process.env.REFRESH_TOKEN,{
        expiresIn: '7d'
    })
}

// register user
const register = async(req,res)=>{
    const {username,email,password,role} = req.body
    if(!username) return res.status(404).json({message:"Please enter a name"})
    if(!email) return res.status(404).json({message:"Please enter a email"})
    if(!password) return res.status(404).json({message:"Please enter a password"})
    const allowedRoles = ["admin", "customer"];
    if (role && !allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

   try {
    const user = await User.findOne({email: email})
    if(user) return res.status(400).json({message:"User already exists"})

        const userCreate = await User.create({
            username,
            email,
            password,
            role: role || 'customer',
            ...(role === 'admin' ? { products: [] } : {})
        })
    
    if (userCreate.role === 'customer') {
        userCreate.products = undefined;
        await userCreate.save();  
    }

    // Send email
    if (userCreate) {
        await sendWelcomeEmail(userCreate.email);  
    }


    res.status(200).json({
        message:"User registered successfully",
        data:userCreate
    })
   } catch (error) {
    console.log(error);
    
   }

}

//login user
const login = async(req,res)=>{
    const {email,password} = req.body
    if(!email) return res.status(404).json({message:"Please enter a email"})
    if(!password) return res.status(404).json({message:"Please enter a password"})

    const user = await User.findOne({email: email})
    if(!user) return res.status(400).json({message:"User not found"})

   try {
    const isPassword = await bcrypt.compare(password, user.password)
    if(!isPassword) return res.status(400).json({message:"incorrect password"})

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        secure :false,
        sameSite : "none",
        path : "/",
        maxAge : 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        message:"User logged in successfully",
        accessToken,
        refreshToken,
        data: user

    })
   } catch (error) {
    console.log(error);
    
   }
}

//logout user
const logout = async (req,res)=>{
    res.clearCookie("refreshToken",{path:"/"})
    res.status(200).json({message:"User logged out successfully"})
}

//refresh user token
const refresh = async (req,res)=>{
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!refreshToken) return res.status(403).json({message:"No refresh token found"})
    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN)
    const user = await User.findOne({email : decoded.email})
    if(!user) return res.status(404).json({message: "Invalid refresh token"});
    const generateToken = generateAccessToken(user)
    res.status(200).json({message: "access token generate",accessToken:generateToken})
    res.json({decoded})
}

export {register,login,logout,refresh}