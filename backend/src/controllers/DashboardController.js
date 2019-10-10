const Dashboard = require('../models/Dashboard')

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

    async show(req, res) {

        const { userId } = req

        const userInfo = await Dashboard.findOne({ user: userId })
            .populate({ path: 'user', select: 'mail' })
            .populate({ path: 'flatmates', select: 'username mail' })
            .populate({ path: 'cashiers', select: 'name balance' })
            .exec();

        return res.json(userInfo)

    }

}

