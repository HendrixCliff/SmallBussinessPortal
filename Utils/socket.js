const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const Message = require("../models/messageSchema");

const ADMIN_ID = "67bf75c3fec31bb6f9f068fd"; // ✅ Hardcoded Admin ID

const initializeSocket = (server, pubClient, subClient) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  global.io = io;
  io.adapter(createAdapter(pubClient, subClient));

  const users = new Map(); // ✅ Store userId -> socketId

  // ✅ Handle User Connections
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on("register", (userId) => {
      if (!users.has(userId)) {
        users.set(userId, socket.id);
        socket.join(userId);
        console.log(`✅ User ${userId} registered with socket ID: ${socket.id}`);
        console.log("🟢 Active Users Map:", users);
      } else {
        console.log(`⚠️ User ${userId} is already registered.`);
      }
    });

    // ✅ User sends message to Admin
    socket.on("sendMessage", async ({ senderId, message }) => {
      console.log(`📩 Message from ${senderId}: ${message}`);

      await saveMessage({ sender: senderId, senderRole: "user", text: message, recipientId: ADMIN_ID });

      const adminSocketId = users.get(ADMIN_ID);
      if (adminSocketId) {
        io.to(adminSocketId).emit("receiveMessage", { senderId, message });
      } else {
        console.warn("⚠️ Admin is offline. Message not delivered.");
      }
    });

    // ✅ Admin replies to a User
    socket.on("adminReply", async ({ receiverId, message }) => {
      console.log(`📨 Admin replying to ${receiverId}: ${message}`);

      await saveMessage({ sender: ADMIN_ID, senderRole: "admin", text: message, recipientId: receiverId });

      const userSocketId = users.get(receiverId);
      if (userSocketId) {
        io.to(userSocketId).emit("receiveMessage", { senderId: ADMIN_ID, message });
      } else {
        console.warn(`⚠️ User ${receiverId} is offline. Message not delivered.`);
      }
    });

    // ✅ Handle User Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);

      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          socket.leave(userId);
          console.log(`❌ User ${userId} removed from active list`);
          break;
        }
      }
    });

    // ✅ Handle Socket Errors
    socket.on("error", (error) => {
      console.error(`❌ Socket Error: ${error.message}`);
    });
  });

  // ✅ Save messages to MongoDB with timestamps
  async function saveMessage({ sender, senderRole, text, recipientId }) {
    try {
      if (!sender || !senderRole || !text || !recipientId) {
        throw new Error("All fields are required!");
      }

      const message = new Message({ sender, senderRole, text, recipientId });
      await message.save();
      console.log("✅ Message saved successfully!");
    } catch (error) {
      console.error("❌ Database Error:", error.message);
    }
  }
};

// ✅ Proper module export
module.exports = { initializeSocket };
