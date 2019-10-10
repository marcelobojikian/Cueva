const Dashboard = require('../models/Dashboard')
const Transaction = require('../models/Transaction')
const Cashier = require('../models/Cashier')

module.exports = {

    async index(req, res) {

        const { userLogged , query} = req

        const transactions = await Transaction.find({
            $and: [
                { owner: userLogged },
                query
            ],
        }).populate({ path: 'owner', select: 'mail' }).exec();

        return res.json(transactions)

    },

    async update(req, res) {

        const { userLogged } = req
        const { transaction, action } = req.body

        if (action != 'confirm') {
            return res.status(400).json({ message: 'Action invalid' })
        }

        const transactionInDB = await Transaction.findById(transaction)
        const { owner, cashier, action: actionTransaction, status, value } = transactionInDB

        const cashiersInDB = await Cashier.findById(cashier)

        if (status == 'FINISHED') {
            return res.status(400).json({ message: "Transaction finished" });
        }

        if (action == 'confirm') {

            const dashboard = await Dashboard.findOne({ user: userLogged })
            const enableToConfirm = dashboard.flatmates
            enableToConfirm.push(userLogged.id)

            if(!enableToConfirm.includes(owner._id)){
                console.log(owner._id, 'not in', enableToConfirm)
                return res.status(400).json({ message: "User does not have permission for this operation" });
            }

            console.log(cashiersInDB.name, ' current:', cashiersInDB.balance)

            if (actionTransaction == 'deposit') {
                cashiersInDB.balance += value
            } else if (actionTransaction == 'withdraw') {
                cashiersInDB.balance -= value
            }

            console.log(actionTransaction, value, 'in', cashiersInDB.name, 'Total:', cashiersInDB.balance)

            transactionInDB.status = 'FINISHED'

            transactionInDB.save()
            cashiersInDB.save()

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
        const cashiersInDB = await Cashier.findOne({ owner: userLogged, name: cashierName })

        if (!cashiersInDB) {
            return res.status(400).json({ message: 'Cashier not exist' })
        }

        const transaction = await Transaction.create({
            owner: userLogged,
            status: "CREATED",
            action: action,
            cashier: cashiersInDB,
            value: value
        })

        dashboard.transactions.push(transaction)
        dashboard.save();

        return res.json({ message: 'Sucess' })

    }

}