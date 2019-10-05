const express = require('express')
const authorization = require("./filters/Authorization")
const database = require("./filters/Database")

const FlatmateController = require('./controllers/FlatmateController')
const CashierController = require('./controllers/CashierController')
const TransactionController = require('./controllers/TransactionController')
const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')
const GuestController = require('./controllers/GuestController')

const routes = express.Router()

routes.get('/', (req, res) => {
    res.json({ status: 'ok' })
})

routes.post('/register', UserController.store)
routes.post('/authenticate', AuthController.show)

routes.use(authorization)
routes.use(database.prepareUser)

routes.post('/user/guest', GuestController.store)
routes.put('/user/update', UserController.update)

routes.post('/flatmate', FlatmateController.store)
routes.post('/cashier', CashierController.store)

routes.post('/cashier/:cashierName/:action', TransactionController.store)

module.exports = routes;