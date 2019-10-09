const Dashboard = require('../models/Dashboard')

module.exports = {

    async index(req, res) {

        const { userLogged } = req

        const userInfo = await Dashboard.findOne({ user: userLogged });

        return res.json(userInfo.cashiers)

    },

    async store(req, res) {

        const { userLogged } = req
        const { cashiers } = req.body

        cashiers.map((cashier, index) => { return cashiers[index].initial = cashier.balance })

        await Dashboard.updateMany({user: userLogged}, {$set: {cashiers}})

        res.json({ message: 'Sucess' })

    }

}