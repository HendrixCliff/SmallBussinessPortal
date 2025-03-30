const express = require("express");
const router = express.Router();
const {  getSpecificUserMessages }= require("./../controllers/messagesController")
//const { verifyUserOrAdmin, verifyAdmin } = require("./../controllers/authController")


router.get("/:userId", getSpecificUserMessages);

module.exports = router;

