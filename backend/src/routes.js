const express = require('express')

const SessionControler = require('./controllers/SessionController')
const FlatmateController = require('./controllers/FlatmateController')
const CashierController = require('./controllers/CashierController')
const TransactionController = require('./controllers/TransactionController')
const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')

const routes = express.Router()

routes.get('/', (req,res) => {
    res.json({status: 'ok'})
})

routes.get('/session', SessionControler.show)
routes.post('/session', SessionControler.store)

routes.put('/user/requiredFirstStep', UserController.requiredFirstStep)

routes.post('/auth/login', AuthController.login)

routes.post('/flatmate', FlatmateController.store)

routes.post('/cashier', CashierController.store)
routes.post('/cashier/:name/withdraw', TransactionController.withdraw)
routes.post('/cashier/:name/deposit', TransactionController.deposit)

module.exports = routes;