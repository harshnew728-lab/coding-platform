const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
    userFirstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 20
    },
     userLastName : {
        type : String,
        minLength : 3,
        maxLength : 20
    },
    userEmail : {
        type : String,
        required : true,
        lowercase : true,
        immutable : true,
        unique : true,
        trim : true
    },
    userPassword : {
        type : String,
        required : true
    },
    userRole : {
        type : String,
        enum : ["admin","user"],
        default : "user"
    },
    userAge : {
        type : Number,
        min : 5,
        max : 80
    },
    userProblemSolved : {
        type : [String]
    }
},{
    timestamps : true
})

const userModel = mongoose.model("users",userSchema)
module.exports = userModel