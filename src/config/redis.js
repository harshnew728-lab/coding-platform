const { createClient } = require("redis");

const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASS,
    socket: {
        host: "redis-18143.crce292.ap-south-1-2.ec2.cloud.redislabs.com",
        port: 18143,
    }
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("Redis Ready");
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

module.exports = redisClient;