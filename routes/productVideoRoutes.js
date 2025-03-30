
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express")
const app = express()
const router = express.Router()
const productsController= require("./../controllers/productsController")

// Multer Storage (Upload to Cloudinary)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "videos",
      resource_type: "video",
    },
  });
  
  const upload = multer({ storage });

 router.post("/upload", upload.single("video"), productsController.uploadProductVideo)
router.get("/productVideos", productsController.getAllProductVideos)
router.delete("/:id", productsController.deleteProductVideo)
module.exports  = router