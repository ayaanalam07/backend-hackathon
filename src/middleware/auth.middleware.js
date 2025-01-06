import jwt from "jsonwebtoken"

//authenticate User middleware
const authenticateUser = async (req,res)=>{
    const token = req.headers["authorization"];
    if(!token) return res.status(401).json({message: "no token found"})
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
    if(err) return res.status(403).json({message : "invalid token"})
    req.user = user;
    next()    
});
}

//export the middleware function
export default authenticateUser;