const express = require("express");
const productController = require("../controllers/productsController");

const router = express.Router();



router.patch("/:id", productController.updateProduct); 
router.delete("/:id", productController.deleteProduct);

module.exports = router;


