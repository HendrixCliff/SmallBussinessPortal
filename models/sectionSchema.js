const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
}, // Unique section identifier
  title:{
     type: String, 
     required: false 
    }, // Optional: for sections with titles
  content: { 
           type: String, 
           required: false 
        }, // Optional: for text content
  image: { 
    type: String, 
    required: false 
}, // Optional: for sections with images
  buttonText: { 
    type: String, 
    required: false 
}, // Optional: for CTA buttons
  buttonLink: { 
    type: String, 
    required: false 
}, // Optional: for links
}, { timestamps: true });

const Section = mongoose.model("Section", SectionSchema);

module.exports = Section;
