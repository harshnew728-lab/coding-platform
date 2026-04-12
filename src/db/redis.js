// import { createClient } from 'redis';
const {createClient} = require("redis")

const client = createClient({
    username: 'default',
    password: '8H54oaAd4XEbI5PTPVkcPhXdazjP4bbo',
    socket: {
        host: 'redis-15320.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 15320
    }
});

client.on("error", (err) => {
    console.error("Redis Client Error", err);
});

module.exports = client



