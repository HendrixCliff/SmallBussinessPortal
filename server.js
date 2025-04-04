require("dotenv").config({path: "./config.env"});
const http = require("http");
const cors = require("cors");
const app = require("./app")
const connectDB = require("./Utils/db");
const cron = require('node-cron');
const winston = require('winston');
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

logger.info('Application started!');


cron.schedule('0 0 * * *', () => {
    console.log('Task runs every midnight');
});



app.use(cors()); // ✅ Allow WebSocket & API requests

const server = http.createServer(app);

// ✅ Connect to MongoDB
connectDB();



// ✅ Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

