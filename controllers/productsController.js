const Product = require("../models/productSchema")
const asyncErrorHandler = require("./../Utils/asyncErrorHandler")
const path = require("path");
// const sharp = require("sharp")
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Video = require("./../models/productVideoSchema")
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})


// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Upload Product with Image (Cloudinary)
exports.uploadProduct = asyncErrorHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    let imageUrls = [];

    // Upload each image to Cloudinary
    for (const file of req.files) {
      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({ error: `Invalid file type: ${file.originalname}` });
      }

      if (file.size > maxSize) {
        return res.status(400).json({ error: `File ${file.originalname} exceeds 10MB limit.` });
      }

      const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
      imageUrls.push(result.secure_url);

      // Delete local file after upload
      fs.unlinkSync(file.path);
    }

    // 🔹 Ensure Required Fields Exist
    const { name, price, description, stock, category } = req.body;
    if (!name || !price || !description || !stock || !category) {
      return res.status(400).json({ error: "All fields (name, price, description, stock, category) are required." });
    }

    // 🔹 Create Product in Database
    const newProduct = await Product.create({
      name,
      price,
      description,
      stock, // ✅ Added stock
      category, // ✅ Added category
      imageUrls,
    });

    res.json({ message: "Upload successful!", data: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


exports.uploadProductVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded!" });
    }

    const { title } = req.body;
    const videoUrl = req.file.path; // This should be Cloudinary URL

    const video = new Video({ title, url: videoUrl });
    await video.save();

    res.status(201).json({ message: "Video uploaded successfully!", video });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

exports.getAllProducts = asyncErrorHandler( async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

exports.getAllProductVideos = asyncErrorHandler(  async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
})



exports.deleteProduct = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
exports.deleteProductVideo = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product
    const product = await Video.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});




exports.updateProduct = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params; 
    const updates = req.body; 

 
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true, 
      runValidators: true, 
    });

  
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

