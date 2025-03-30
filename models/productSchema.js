const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
price:
  {
  type: String,
  required: true,
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  }, // Track available stock
  category: { 
    type: String 
  },
description: 
  {
    type: String,
    required: true,
  },
  imageUrls: 
  [
    {
      type: String,
      required: true,
    }
  ]
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
