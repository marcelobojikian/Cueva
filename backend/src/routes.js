const express = require('express')
const filterToken = require("./services/auth");

const FlatmateController = require('./controllers/FlatmateController')
const CashierController = require('./controllers/CashierController')
const TransactionController = require('./controllers/TransactionController')
const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')

const routes = express.Router()

routes.get('/', (req, res) => {
    res.json({ status: 'ok' })
})

routes.post('/register', UserController.register)
routes.post('/authenticate', AuthController.authenticate)

routes.use(filterToken);

routes.get('/me', AuthController.me)

routes.put('/user/requiredFirstStep', UserController.requiredFirstStep)

routes.post('/flatmate', FlatmateController.store)

routes.post('/cashier', CashierController.store)
routes.post('/cashier/:name/withdraw', TransactionController.withdraw)
routes.post('/cashier/:name/deposit', TransactionController.deposit)

module.exports = routes;