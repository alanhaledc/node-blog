const redis = require('redis')
const { REDIS_CONFIG } = require('../config/db')

const redisClient = redis.createClient(REDIS_CONFIG)

redisClient.on('err', err => console.error(err))

module.exports = redisClient
