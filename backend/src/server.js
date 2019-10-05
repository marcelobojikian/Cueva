const express = require('express')
const routes = require('./routes')

const path = require('path')
const storeApp = require('data-store')('storeApp', { path: path.resolve(__dirname, '..', './database.json') });
const storeUser = require('data-store')('storeUser', { path: path.resolve(__dirname, '..', './users.json') });

const app = express()

app.use((req, res, next) => {
    req.storeApp = storeApp;
    req.storeUser = storeUser;
    return next();
})

app.use(express.json())
app.use(routes)

app.listen(3334)