const Dashboard = require('../models/Dashboard')
const Cashier = require('../models/Cashier')

module.exports = {

    async index(req, res) {

        const { userLogged } = req

        const cashiers = await Cashier.find({
            $or: [
                { owner: userLogged },
                { owner: { $in: userLogged.invitedBy } }
            ],
        })

        return res.json(cashiers)

    },

    async store(req, res) {

        const { userLogged } = req
        const { cashiers } = req.body

        cashiers.map((cashier, index) => { 
            cashiers[index].owner = userLogged.id
            cashiers[index].initial = cashier.balance 
            return
        })

        const cashiersInDB = await Cashier.create(cashiers)
        await Dashboard.updateMany({ user: userLogged }, { $set: { cashiers: cashiersInDB } })

        res.json({ message: 'Sucess' })

    }

}