const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, required: true },
  text: { type: String, required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
