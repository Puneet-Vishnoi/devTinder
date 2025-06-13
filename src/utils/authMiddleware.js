const JsonWebToken = require("jsonwebtoken")
const User = require("../models/user")

const authMiddleware = async (req, res, next)=>{
  const cookies = req.cookies
  try{
    const {token} = cookies
    if(!token){
      throw new Error("invalid token")
    }
    const decodedMessage = await JsonWebToken.verify(token, "DEV@Tinder007$SecretKey");
    const user = await User.findOne({ _id: decodedMessage._id });
    
    if(!user){
      return res.status(404).send("user not found")
    }

    req.user = user; 
    next();
  }
  catch(err){
    res.status(401).send("Authorization Error: "+ err?.message)
  }
}

module.exports = authMiddleware