const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("./../controllers/productsController");

const router = express.Router();

// 🔹 Configure Multer (Temporary Storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// 🔹 File Filter (Allow only images)
const fileFilter = (req, file, cb) => {
  const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
  }
};

// 🔹 Multer Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});


const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// ✅ Routes
router.post(
  "/upload",
  upload.array("images", 5),  // Allow multiple image uploads (up to 5)
  handleMulterError,          // Handle upload errors
  productController.uploadProduct
);

router.get("/", productController.getAllProducts);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
