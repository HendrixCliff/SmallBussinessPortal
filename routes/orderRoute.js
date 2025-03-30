const express = require("express");
const router = express.Router();
const { placeAnOrder, getAllPlacedOrders } = require("./../controllers/orderController")


  
  // Define your route correctly
  router.post("/order", placeAnOrder);
  
router.get("/sold-products", getAllPlacedOrders)

module.exports = router