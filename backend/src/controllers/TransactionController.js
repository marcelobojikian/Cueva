const Dashboard = require('../models/Dashboard')
const Transaction = require('../models/Transaction')

module.exports = {

    async index(req, res) {

        const { userLogged, query } = req

        const transactions = await Transaction.find({
            $and: [
                { owner: userLogged },
                query
            ],
        })
        .populate({ path: 'owner', select: 'mail' })
        .exec();

        return res.json(transactions)

    },

    async update(req, res) {

        const { userLogged } = req
        const { transaction, action } = req.body

        if (action != 'confirm') {
            return res.status(400).json({ message: 'Action invalid' })
        }

        const transactionInDB = await Transaction.findById(transaction)
        const { cashier: cashierName, action: actionTransaction, status, value } = transactionInDB

        if (status == 'FINISHED') {
            return res.status(400).json({ message: "Transaction finished" });
        }

        if (action == 'confirm') {

            const dashboard = await Dashboard.findOne({ user: userLogged })

            const cashierArray = dashboard.cashiers
            const cashier = cashierArray.find(({ name }) => { return name === cashierName });

            console.log(cashier.name, ' current:', cashier.balance)

            if (actionTransaction == 'deposit') {
                cashier.balance += value
            } else if (actionTransaction == 'withdraw') {
                cashier.balance -= value
            }

            console.log(actionTransaction, value, 'in', cashier.name, 'Total:', cashier.balance)

            transactionInDB.status = 'FINISHED'

            transactionInDB.save()
            dashboard.save();

        }

        return res.json({ message: 'Sucess' })

    },

    async store(req, res) {

        const { userLogged } = req
        const { value } = req.body
        const { cashierName, action } = req.params

        if (action != 'deposit' && action != 'withdraw') {
            return res.status(400).json({ message: 'Action invalid' })
        }

        const dashboard = await Dashboard.findOne({ user: userLogged })

        const cashierArray = dashboard.cashiers
        const cashier = cashierArray.find(({ name }) => { return name === cashierName });

        if (!cashier) {
            return res.status(400).json({ message: 'Cashier not exist' })
        }

        const transaction = await Transaction.create({
            owner: userLogged,
            status: "CREATED",
            action: action,
            cashier: cashierName,
            value: value
        })

        dashboard.transactions.push(transaction)
        dashboard.save();

        return res.json({ message: 'Sucess' })

    }

}