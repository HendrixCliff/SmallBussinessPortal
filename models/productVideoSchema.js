const mongoose = require("mongoose")




const VideoSchema = new mongoose.Schema({
    title: String,
    url: String, 
  });

  const Video = mongoose.model("Video", VideoSchema);
 
  module.exports = Video