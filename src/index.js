const express = require("express")
const validator = require('validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const connectDatabase = require("./db/mongoose")
const redisClient = require("./db/redis")
const tokenValidator = require("./controllers/tokenValidator")
const userRouter = require("./routes/user")
const problemRouter = require("./routes/problemRoutes")
const submissionRouter = require("./routes/submissions")

const app = express()
app.use(express.json());

app.use(cookieParser())

app.use("/user",userRouter)
app.use("/problem",problemRouter)
app.use("/submission",submissionRouter)

async function initializeConnections(){
    try{

        await Promise.all([connectDatabase(),redisClient.connect()]);
        console.log("DB Connected");
        
        app.listen(4000, ()=>{
            console.log("Server has started listening");
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}

initializeConnections()
