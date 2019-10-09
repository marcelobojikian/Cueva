const Dashboard = require('../models/Dashboard')

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

    async show(req, res) {

        const { userId } = req

        const userInfo = await Dashboard.findOne({ user: userId })
            .populate({ path: 'user', select: 'mail requiredFirstStep' })
            .populate({ path: 'flatmates', select: 'mail' })
            .exec();

        return res.json(userInfo)

    }

}

