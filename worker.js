const Queue = require("bull");

// Connect to Redis
const emailQueue = new Queue("emailQueue", { redis: { host: "127.0.0.1", port: 6379 } });

// Process jobs
emailQueue.process(async (job) => {
  console.log(`📬 Sending email to: ${job.data.email}`);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate email delay
  console.log(`✅ Email sent to: ${job.data.email}`);
});
