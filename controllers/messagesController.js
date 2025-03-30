const asyncErrorHandler = require("./../Utils/asyncErrorHandler")
const Message = require("../models/messageSchema"); // Ensure this is correctly imported

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Replace with actual API URL
const ADMIN_ID = '67bf75c3fec31bb6f9f068fd'; 
// Function to send message to external API



exports.getSpecificUserMessages = asyncErrorHandler(async (req, res) => {
  const { userId } = req.params; // Extract userId from request

  try {
    // Fetch messages between the user and the admin
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: ADMIN_ID }, // Messages from user to admin
        { senderId: ADMIN_ID, receiverId: userId }, // Messages from admin to user
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation timestamp

    res.status(200).json({ success: true, messages }); // Send messages as JSON response
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" }); // Handle errors
  }
});



