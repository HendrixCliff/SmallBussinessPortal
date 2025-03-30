const Section = require("../models/sectionSchema"); // Import schema
const asyncErrorHandler = require("./../Utils/asyncErrorHandler")

// Create or update a section
exports.sectionUpload = asyncErrorHandler(  async (req, res) => {
    const { key, title, content, image, buttonText, buttonLink } = req.body;

    try {
      const section = await Section.findOneAndUpdate(
        { key }, // Find by unique key
        { title, content, image, buttonText, buttonLink }, // Update data
        { new: true, upsert: true } // Create if doesn't exist
      );
      res.json(section);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  })

  exports.sectionDownload = asyncErrorHandler(  async (req, res) => {
    try {
        const section = await Section.findOne({ key: req.params.key });
        if (!section) return res.status(404).json({ message: "Section not found" });
        res.json(section);
      } catch (error) {
        res.status(500).json({ error: "Error fetching section" });
      }
  })

  exports.sectionDelete = asyncErrorHandler(  async (req, res) => {
        try {
          await Section.findOneAndDelete({ key: req.params.key });
          res.json({ message: "Section deleted successfully" });
        } catch (error) {
          res.status(500).json({ error: "Error deleting section" });
        }
      });
      


 