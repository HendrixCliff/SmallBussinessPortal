const { createClient } = require("redis");

const connectRedis = async () => {
  const pubClient = createClient({ url: "redis://127.0.0.1:6379" });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  return { pubClient, subClient };
};

module.exports = { connectRedis };
