const mongoose = require("mongoose")
const {Schema} = mongoose
const visibleTestCaseSchema = new Schema({
    input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
},{_id:false})
const hiddenTestCaseSchema = new Schema({
     input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
},{_id:false})
const startingCodeSchema = new Schema({
    language : {
                type : String,
                required : true
            },
            codeTemplate : {
                type : String,
                required : true
            }
},{_id:false})
const referenceSolutionSchema = new Schema({
    language : {
                type : String,
                required : true
            },
            completeCode : {
                type : String,
                required : true
            }
},{_id:false})

const problemSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        required : true,
        enum : ["basic","easy","medium","hard"]
    },
    tags : {
        type : [String],
    },
    visibleTestCases : [visibleTestCaseSchema],

    hiddenTestCases : [hiddenTestCaseSchema],

    constraints : {
        type : [String],
        default : []
    },

    startingCode : [startingCodeSchema],

    referenceSolution : [referenceSolutionSchema],

    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "users"
    },
    lastUpdated : {
        type : Date,
        required : true
    },
    updatedBy : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required : true
    }
},{
    timestamps : true
})

const problemModel = mongoose.model("problems",problemSchema)
module.exports = problemModel