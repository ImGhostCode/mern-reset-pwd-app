const { createClient } = require('redis')
const client = createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
})

client.ping((err, result) => {
    console.log(result)
})

client.on('connect', () => {
    console.log("Redis client connected")
})

client.on('error', error => {
    console.error(error)
})

module.exports = client