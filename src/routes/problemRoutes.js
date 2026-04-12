const express = require("express")
const router = express.Router()

const tokenValidator = require("../controllers/tokenValidator")
const {createProblem,updateProblem,deleteProblem} = require("../controllers/problemControllers")
// can only be done by admin
router.post("/createProblem",tokenValidator,createProblem)
router.put("/updateProblem/:id",tokenValidator,updateProblem)
router.post("/deleteProblem",deleteProblem)


// // both admin/user can call
// router.get("/getProblemById/:id",getProblemById)
// router.get("/getAllProblems",getAllProblems)

module.exports = router