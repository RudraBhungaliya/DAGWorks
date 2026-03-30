import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

export const redisClient = createClient(
    redisUrl ? { url: redisUrl } : {}
);

redisClient.on("connect", () => {
    console.log("Redis connected");
});

redisClient.on("error", (err) => {
    console.error(`Redis error : ${err}`);
});

export const connectRedis = async () => {
    await redisClient.connect();
}