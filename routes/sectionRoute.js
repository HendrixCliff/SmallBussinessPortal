const express = require("express")
const router = express.Router();
const {sectionUpload, sectionDelete, sectionDownload} = require("./../controllers/sectionController")



router.post("/sectionUpload", sectionUpload)
router.get("/:key", sectionDownload)
router.delete("/:key", sectionDelete)

module.exports = router