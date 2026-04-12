const mongoose = require("mongoose")
const problemModel = require("../models/problemModel")
const submissionModel = require("../models/submissionsModel")
const {getLanguageId,submitBatch,submitTokens,getStatus} = require('../problemUtility')

const submitProblem = async(req,res) => {
    // get the id
    const {id} = req.params
    if(!id)
        return res.status(400).send("id not present")
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("invalid id given")
    // get all the necessary details
       // check if details exists
    const {language,code} = req.body
    if(!language || !code)
        return res.status(400).send("missing required fields")

    // check if problem exists
    const problemExists = await problemModel.findById(id)
    if(!problemExists)
        return res.status(400).send("invalid request")
    // submit the problem's solution
    const newSubmission = await submissionModel.create({
        problemId : id,
        userId : req.user._id,
        testCasesPassed : 0,
        testCasesTotal : problemExists.hiddenTestCases.length,
        problemStatus : "pending",
        code,
        language
    })
    // run the code
    try{
       // get the language id
        const languageId = getLanguageId(language)

    // create the submissions batch  
    let submissions = problemExists.hiddenTestCases.map(({input,output})=>({
        source_code : code,
        language_id : languageId,
        stdin : input,
        expected_output : output
    }))

    // send this submissions batch to judge0
    // judge0 will send the tokens 
    const submitResult = await submitBatch(submissions)

    // send these tokens again to judge0
    const tokens = submitResult.map((value)=>value.token)
    
    const testResult = await submitTokens(tokens)

    let errorMessage = ""
    let passedTestCases = 0
    let runT = 0
    let mUsage = 0
    let problemState;
console.log(testResult); 

    for(let result of testResult.submissions){
        if(!result)
            continue;
        if(result.status_id !==3)
        {
            errorMessage = result.stderr || result.compile_output || "wrong answer";
            problemState = getStatus(result.status_id)
            break;
        }
        passedTestCases++
        runT = runT + parseFloat(result.time)
        mUsage = Math.max(mUsage,result.memory)
    }


    if(passedTestCases!==problemExists.hiddenTestCases.length){
        newSubmission.errorMessage = errorMessage
        newSubmission.problemStatus = problemState
    }
    else{
        newSubmission.testCasesPassed = passedTestCases
        newSubmission.memoryUsage = mUsage
        newSubmission.runtime = runT
        newSubmission.problemStatus = "accepted"
    }
   
    // update the submission
    const updatedProblem = await newSubmission.save()

    // send the result to the user
    return res.status(201).json({
        message : "problem submitted successfully",
        submissionDetails : updatedProblem
    })

}
catch(err){
   return res.status(500).json({ error: err.message || "Internal Server Error" });
}
    

}

module.exports = {submitProblem}

