const {getLanguageId,submitBatch,submitTokens} = require('../problemUtility')

const problemModel = require("../models/problemModel")
const mongoose = require('mongoose')

const createProblem = async(req,res) => {
    // check if user is admin or not
    try{
    if(req.user.userRole !== "admin")
        return res.status(403).send("you are not authorized for this operation")

    const{title,description,difficulty,visibleTestCases,startingCode,referenceSolution} = req.body

    if(!title || !description || !difficulty ||!visibleTestCases || !startingCode ||!referenceSolution)
       return res.status(400).send("missing required fields")

     // Check if problem already exists
    const existingProblem = await problemModel.findOne({ title });
    if (existingProblem) {
      return res.status(409).send("A problem with this title already exists");
    }


    // create the submissions batch
    let submissions;
    for({language,completeCode}of referenceSolution){
        // get the language id
        const languageId = getLanguageId(language)

       submissions = visibleTestCases.map((testCase)=>({
        source_code : completeCode,
        language_id : languageId,
        stdin : testCase.input,
        expected_output : testCase.output
       }))
    }

    // send this submissions batch to judge0
    // judge0 will send the tokens 
    const submitResult = await submitBatch(submissions)

    // send these tokens again to judge0
    const tokens = submitResult.map((value)=>value.token)
    
    const testResult = await submitTokens(tokens)

    const success = testResult.submissions.every((res)=>res.status_id == 3)
    if(!success)
       return res.status(400).send("unable to create the problem")

   
    // set problem creator 
    req.body.createdBy = req.user._id

    // create the problem in the database
    const newProblem = await problemModel.create({...req.body,lastUpdated : Date.now(),updatedBy :req.user._id })

    // console.log(submitResult);
    console.log(testResult);

    
    res.status(201).json({
        message : "problem created successfully",
        problem_details : newProblem
    })

}
catch(err){
    res.status(500).send("Error : "+err)
}

}

const updateProblem = async(req,res) => {
    try{
    if(req.user.userRole !== "admin")
        return res.status(403).send("you are not authorized for this operation")
    const {id} = req.params
    if(!id)
        return res.status(400).send("missing problem id")

    const{title,description,difficulty,visibleTestCases,startingCode,referenceSolution,hiddenTestCases} = req.body

    if(!title || !description || !difficulty ||!visibleTestCases || !startingCode ||!referenceSolution || !hiddenTestCases)
       return res.status(400).send("missing required fields")

     // Check if problem already exists
   
     const problemAlreadyExists = await problemModel.findOne({title : title})
     if(problemAlreadyExists)
        return res.status(400).send("problem with this title already exists");

    const problemExists = await problemModel.findById(id);
    if (!problemExists) 
      return res.status(400).send("problem does not exists");

    
    // create the submissions batch
    let submissions;
    for({language,completeCode}of referenceSolution){
        // get the language id
        const languageId = getLanguageId(language)

       submissions = visibleTestCases.map((testCase)=>({
        source_code : completeCode,
        language_id : languageId,
        stdin : testCase.input,
        expected_output : testCase.output
       }))
    }

    // send this submissions batch to judge0
    // judge0 will send the tokens 
    const submitResult = await submitBatch(submissions)

    // send these tokens again to judge0
    const tokens = submitResult.map((value)=>value.token)
    
    const testResult = await submitTokens(tokens)

    const success = testResult.submissions.every((res)=>res.status_id == 3)
    if(!success)
       return res.status(400).send("unable to create the problem")
    

    // save the new changes in the problem
        problemExists.title = title;
        problemExists.description = description;
        problemExists.difficulty = difficulty;
        problemExists.visibleTestCases = visibleTestCases;
        problemExists.hiddenTestCases = hiddenTestCases
        problemExists.startingCode = startingCode;
        problemExists.referenceSolution = referenceSolution;
   
    // set problem lastUpdatedAt ans updatedBy
    // req.body.createdBy = req.user._id
    problemExists.lastUpdated = Date.now()
    problemExists.updatedBy = req.user._id

    const updatedProblem = await problemExists.save()

    res.status(201).json({
        message : "problem updated successfully",
        updateDetails : updatedProblem

    })
    

    }
    catch(err){
        res.status(500).send("Error : "+err)
    }
}

const deleteProblem = async(req,res) => {
    try{
    // check if user is admin or not
    if(req.user.userRole !== "admin")
        return res.status(403).send("you are not authorized for this operation")
    const {id} = req.params
    if(!id)
        return res.status(400).send("missing problem id")

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("invalid id")

    const problemExists = await problemModel.findById(id)
    if(!problemExists)
        return res.status(400).send("no such problem exists")

    await problemModel.findByIdAndDelete(id)

    return res.status(200).json({
        message : "problem deleted successfully"
    })

}
catch(err){
    res.status(500).send("Error : "+err)
}

}

// const getProblemById = (req,res) => {

// }

// const getAllProblems = (req,res) => {

// }
module.exports = {createProblem,updateProblem,deleteProblem}