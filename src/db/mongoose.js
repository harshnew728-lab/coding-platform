const mongoose = require("mongoose")

async function connectDatabase(){
    await mongoose.connect(process.env.MONGO_URI)
}

module.exports = connectDatabase