import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    }
});

redisClient.on('error', (err) => {
    console.log('Redis Connection Log:', err.message);
});

redisClient.on('connect', () => {
    console.log('Redis connected');
});

export default redisClient;