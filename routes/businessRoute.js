const express = require("express");
const router = express.Router();
const {recallBusinesses, registerBusiness, searchBusinesses} = require("./../controllers/businessController")
const { protect } = require("./../controllers/authController")
const { body} = require("express-validator");

router.get("/:slug", recallBusinesses)
router.post(
    "/register", protect,
    [
      body("name").notEmpty().withMessage("Business name is required"),
      body("contact").notEmpty().withMessage("Contact is required"),
    ], registerBusiness)

router.get("/search", searchBusinesses)

module.exports = router;