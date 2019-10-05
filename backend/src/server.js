const express = require('express')
const routes = require('./routes')

const database = require("./filters/Database")

const app = express()

app.use(database.injectDatabase)

app.use(express.json())
app.use(routes)

app.listen(3334)