const mongoose = require('mongoose');
const Dashboard = require('../models/Dashboard')
const Transaction = require('../models/Transaction')
const Cashier = require('../models/Cashier')
const User = require('../models/User')
const CmdTransaction = require('../command/CmdTransaction')

const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    async index(req, res) {

        const { userLogged, query } = req
        const { groupBy, status, cashier_id, action } = query

        const dashboard = await Dashboard.findOne({ user: userLogged })

        const queryParameters = []

        if (status) {
            const statusArray = status.split(',').map(status => status.trim())
            queryParameters.push({ status: { $in: statusArray } })
        }
        if (cashier_id) {
            queryParameters.push({ cashier: ObjectId(cashier_id) })
        }
        if (action) {
            queryParameters.push({ action: action })
        }

        if (groupBy == 'date') {

            const transactions = await Transaction.aggregate([
                {
                    $match: {
                        $or: [
                            { owner: userLogged._id },
                            { _id: { $in: dashboard.transactions } }
                        ],
                        $and: queryParameters
                    }
                },
                {
                    $addFields: {
                        userLoggedId: userLogged._id,
                    }
                },
                { $sort: { "createdAt": -1 } },
                ...Transaction.aggGroupByDate
            ])

            return res.json(transactions)

        } else {

            const transactions = await Transaction.find(
                {
                    $or: [
                        { owner: userLogged },
                        { _id: { $in: dashboard.transactions } }
                    ],
                    $and: queryParameters
                },
                'status action value')
                .sort({ createdAt: -1 })
                .populate({ path: 'createdBy', select: '_id username mail' })
                .populate({ path: 'owner', select: '_id username mail' })
                .populate({ path: 'cashier', select: '_id owner mail' })
                .exec();

            return res.json(transactions)

        }

    },

    async update(req, res) {

        try{ 

            const { userLogged } = req
            const { transaction_id, action } = req.body

            const command = new CmdTransaction(userLogged, transaction_id, action);

            await command.Execute();
            return res.json({ message: 'Sucess' })

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

    },

    async store(req, res) {

        const { userLogged } = req
        const { flatmate_id, value } = req.body
        const { cashier_id, action } = req.params

        if (action != 'deposit' && action != 'withdraw') {
            return res.status(400).json({ message: 'Action invalid' })
        }

        const cashiersInDB = await Cashier.findById(cashier_id)

        if (!cashiersInDB) {
            return res.status(400).json({ message: 'Cashier not exist' })
        }

        if (cashiersInDB.owner._id != userLogged.id &&
            userLogged.invitedBy.includes(cashiersInDB.owner.id)) {
            return res.status(400).json({ message: 'Access denied' })

        }

        const dashboard = await Dashboard.findOne({ user: cashiersInDB.owner })

        if (flatmate_id) {

            if (!dashboard.flatmates.includes(flatmate_id)) {
                return res.status(400).json({ message: 'Flatmate invalido' })
            }

            const userDB = await User.findById(flatmate_id)

            const transaction = await Transaction.create({
                createdBy: userLogged,
                owner: userDB,
                status: "CREATED",
                action: action,
                cashier: cashiersInDB,
                value: value
            })

            dashboard.transactions.push(transaction)

        } else {

            const transaction = await Transaction.create({
                createdBy: userLogged,
                owner: userLogged,
                status: "CREATED",
                action: action,
                cashier: cashiersInDB,
                value: value
            })

            dashboard.transactions.push(transaction)

        }

        dashboard.save();

        return res.json({ message: 'Sucess' })

    }

}