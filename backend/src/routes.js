const express = require('express')
const authorization = require("./filters/Authorization")
const database = require("./filters/Database")

const FlatmateController = require('./controllers/FlatmateController')
const CashierController = require('./controllers/CashierController')
const TransactionController = require('./controllers/TransactionController')
const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')
const DashboardController = require('./controllers/DashboardController')
const GuestController = require('./controllers/GuestController')

const routes = express.Router()

routes.get('/', (req, res) => {
    res.json({ status: 'ok' })
})

routes.post('/register', UserController.store)
routes.post('/authenticate', AuthController.show)

routes.use(authorization)
routes.use(database.existUser)

routes.get('/dashboard', DashboardController.show)

routes.get('/user', UserController.show)
routes.put('/user/update', UserController.update)

routes.post('/user/guest', GuestController.store)
routes.post('/user/flatmate', FlatmateController.store)

routes.get('/user/cashiers', CashierController.index)
routes.post('/user/cashier', CashierController.store)

routes.get('/user/transactions', TransactionController.index)
routes.put('/user/transaction', TransactionController.update)

routes.post('/user/cashier/:cashierName/:action', TransactionController.store)

module.exports = routes;