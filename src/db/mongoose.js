const mongoose = require("mongoose")

async function connectDatabase(){
    await mongoose.connect("mongodb+srv://HR_agarwal:hr%40mongoose1234@mangocluster.dlvojw3.mongodb.net/Leetcode")
}

module.exports = connectDatabase