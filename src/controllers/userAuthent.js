const validator = require('validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const redisClient = require('../db/redis')
const mongoose = require("mongoose")


const userRegister = async(req,res)=>{
    // mandatory fields
    const mandatoryFields = ['userFirstName','userPassword',"userEmail"]
    const fieldsPresent = mandatoryFields.every((field)=> Object.keys(req.body).includes(field) && req.body[field].trim()!="");
    try{
    if(!fieldsPresent)
        throw new Error("missing required credentials")
    // validate the fields
    if(!validator.isEmail(req.body.userEmail.toLowerCase()))
        throw new Error("invalid email id")
    if(!validator.isStrongPassword(req.body.userPassword))
        throw new Error("password very weak")
    // check if user already exists by that credentials
    const userAlreadyExists = await userModel.findOne({userEmail:req.body.userEmail})
    if(userAlreadyExists)
        throw new Error("user already exists")
    // store the user info in db (after hashing the password and setting the role)
    req.body.userEmail = req.body.userEmail.toLowerCase()
    req.body.userPassword = await bcrypt.hash(req.body.userPassword,10)
    req.body.userRole = "user"
    const user = await userModel.create(req.body)
    // send token
    const token = jwt.sign({userId : user._id,userRole : "user",userEmail : user.userEmail},"secret-key",{expiresIn:"1h"})
    res.cookie("token",token,{maxAge:60*60*1000})
    // confirm registeration
    return res.status(201).json({
        message : "user registered successfully",
        userDetails : {
             userFirstName: user.userFirstName,
             userLastName: user.userLastName,
             userEmail: user.userEmail,
             userRole: user.userRole
        }
    })
}
catch(err){
    res.status(400).send("Error : "+err)
}
}


const userLogin = async(req,res) => {
    // check for required fields
    const {userEmail,userPassword} = req.body
    try{
    if(!userEmail)
        throw new Error("missing required login credentials")
    if(!userPassword)
        throw new Error("missing required login credentials")
    // check if such user exists
    const userExists = await userModel.findOne({userEmail : req.body.userEmail.toLowerCase()})
    if(!userExists)
        throw new Error("invalid login credentials")
    // check for validity of input fields (email,password)
    const passwordMatched = await bcrypt.compare(userPassword,userExists.userPassword)
    if(!passwordMatched)
        throw new Error("invalid login credentials")
    // generate and send the token
    const token = jwt.sign({userId : userExists._id,userRole : userExists.userRole,userEmail : userExists.userEmail},"secret-key",{expiresIn:"1h"})
     res.cookie("token",token,{maxAge:60*60*1000})
    // confirm login
     return res.status(200).json({
        message : "user logged in successfully",
    })
}
catch(err){
    res.status(400).send("Error : "+err)
}
}

const userLogout = async(req,res) => {
try{
    const {token} = req.cookies
    const payload = jwt.decode(token)
    // set the token in redis
    await redisClient.set(`token${token}`,"blocked")
    await redisClient.expireAt(`token${token}`,payload.exp)
    // expire the cookie
    res.cookie("token","",{maxAge :0})
    // send the confirmation
    res.status(200).json({
        message : "user logged out successfully"
    })
    }
catch(err){
    res.status(503).send("Error : "+err)
}
}

const adminRegister = async(req,res) => {

    // check if user is admin or not
    if(req.user.userRole !=="admin")
        return res.status(403).send("you are not authorized for this operation")
  
     // mandatory fields
    const mandatoryFields = ['userFirstName','userPassword',"userEmail","userRole"]
    const fieldsPresent = mandatoryFields.every((field)=> Object.keys(req.body).includes(field) && req.body[field]!="");
    try{
    if(!fieldsPresent)
        throw new Error("missing required credentials")
    // validate the fields
    if(!validator.isEmail(req.body.userEmail.toLowerCase()))
        throw new Error("invalid credentials")
    if(!validator.isStrongPassword(req.body.userPassword)) 
        throw new Error("invalid credentials")
    // check if user already exists by that credentials
    const userAlreadyExists = await userModel.findOne({userEmail:req.body.userEmail})
    if(userAlreadyExists)
        throw new Error("user already exists")
    // store the user info in db (after hashing the password and setting the role)
    req.body.userEmail = req.body.userEmail.toLowerCase()
    req.body.userPassword = await bcrypt.hash(req.body.userPassword,10)
    req.body.userRole = req.body.userRole.toLowerCase()
    const user = await userModel.create(req.body)
    // confirm registeration
    return res.status(201).json({
        message : "admin registered successfully",
    })
}
catch(err){
    res.status(400).send("Error : "+err)
}

}
const getUserById = async(req,res)=> {
    const {id} = req.params
    // check if id is sent or not
    try{
    if(!id)
        throw new Error("invalid get request")

    // Validate id format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format");
        }
    // check if user exists
     const user = await userModel.findById(id).select("userFirstName userLastName userEmail userAge userProblemSolved")
     if(!user)
        throw new Error("invalid user id passed")  
    
    res.status(200).json({
        message : "user details fetched successfully",
        userInfo : user
    })
}
catch(err){
    res.status(400).send("Error : "+err)
}
}
module.exports = {userRegister,userLogin,userLogout,adminRegister,getUserById}