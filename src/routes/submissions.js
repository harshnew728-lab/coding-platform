const express = require("express")
const router = express.Router()
const tokenValidator = require("../controllers/tokenValidator")
const {submitProblem} = require("../controllers/submissionControllers")

router.post("/submitProblem/:id",tokenValidator,submitProblem)



module.exports = router