   const userModel = require('../models/userModel')
   const jwt = require("jsonwebtoken")
   const redisClient = require("../db/redis")
   const tokenValidator = async(req,res,next) => {
    
    try{
    // check if token present in cookie
    const {token} = req.cookies
    if(!token)
        throw new Error("token not present")
    // verify the token (if malformed)
    const verifyToken = jwt.verify(token,"secret-key")
    // check if user/token already logged out (token present in redis)
    const isBlocked = await redisClient.exists(`token${token}`)
    if(isBlocked)
        throw new Error("invalid token")

    const user = await userModel.findById(verifyToken.userId) 
    if(!user)
        throw new Error("invalid token")
    req.user = user
    next()
}
catch(err){
     res.status(401).send("Error : "+err)
}
}

module.exports = tokenValidator