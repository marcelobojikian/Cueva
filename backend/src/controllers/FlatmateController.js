const User = require('../models/User')
const Dashboard = require('../models/Dashboard')

module.exports = {

    async store(req, res) {

        const { userLogged } = req
        const { flatmates } = req.body

        const emails = flatmates.map((flatmate) => { return flatmate.mail })

        const flatmatesInDB = await User.find({ mail: { $in: emails } })

        await Dashboard.updateMany({ user: userLogged }, { $set: { flatmates: flatmatesInDB } })

        return res.json({ message: 'Sucess' })

    }

}