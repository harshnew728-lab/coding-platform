const mongoose = require("mongoose")
const {Schema} = mongoose

const submissionSchema = new Schema({
    problemId : {
        type : Schema.Types.ObjectId,
        ref : "problems",
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    testCasesPassed : {
        type : Number,
        required : true,
        default : 0   
    },
    testCasesTotal : {
        type : Number,
        required : true,
        default : 0
    },
    runtime : {
        type : Number,
        required : true,
        default : 0
    },
    memoryUsage : {
        type : Number,
        required : true,
        default : 0
    },
    problemStatus: {
    type: String,
    // enum: ['pending', 'accepted', 'wrong answer', 'runtime error', 'compilation error', 'time limit exceeded'],
    default : "pending"
    },
    code : {
        type : String,
    },
    language : {
        type : String,
        enum : ["c++","python","javascript"]
    },
    errorMessage : {
        type : String,
        default : ""
    }

},{
    timestamps : true
})

const submissionModel = mongoose.model("submissions",submissionSchema)

module.exports = submissionModel