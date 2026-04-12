const express = require("express")
const router = express.Router()

const tokenValidator = require("../controllers/tokenValidator")
const loginValidator = require("../controllers/loginValidator")
const {userRegister,userLogin,userLogout,adminRegister,getUserById} = require("../controllers/userAuthent")


router.post("/userRegister",userRegister)
router.post("/userLogin",userLogin)
router.post("/userLogout",tokenValidator,userLogout)
router.post('/adminRegister',tokenValidator,adminRegister)
router.get('/getUserById', (req, res) => {
    res.status(400).json({ message: "User ID is required in the URL" });
});

router.get('/getUserById/:id',loginValidator,getUserById)

module.exports = router