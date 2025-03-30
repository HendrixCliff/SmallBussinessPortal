const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")




router.post("/login",   authController.login)
router.post("/signup",  authController.signup)
// router.route("/forgotPassword").post(authController.forgotPassword)
// router.route("/resetPassword/:token").patch(authController.resetPassword)

module.exports = router 