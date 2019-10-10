const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')

process.env.NODE_ENV = 'development';
require('../config/config');

const server = express()

mongoose.connect(global.gConfig.mongodb_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

server.use(cors())
server.use(express.json())
server.use(routes)

server.listen(global.gConfig.express_port)