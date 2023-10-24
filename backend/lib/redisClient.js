const Redis = require("ioredis");
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  //   password: process.env.REDIS_PASSWORD,
  db: 0,
}); // Pass config if needed

module.exports = redisClient;
