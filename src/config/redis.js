const {createClient}=require('redis')


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'toad-addition-jaunty-75251.db.redis.io',
        port: 10631
    }
});

module.exports=redisClient;
//upr default code 