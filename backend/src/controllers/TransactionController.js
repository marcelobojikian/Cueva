const App = require('../models/App')

module.exports = {

    async store(req, res) {

        const { userId } = req
        const { value } = req.body
        const { cashierName, action } = req.params

        if (action != 'deposit' && action != 'withdraw') {
            return res.status(400).json({ message: 'Action invalid' })
        }

        const userInfo = await App.findOne({ user: userId })

        const cashierArray = userInfo.cashiers
        const cashier = cashierArray.find(({ name }) => { return name === cashierName });

        if (!cashier) {
            return res.status(400).json({ message: 'Cashier not exist' })
        }

        userInfo.transactions.push({
            owner: userInfo,
            action: action,
            value: value
        })

        userInfo.save();

        return res.json({ message: 'Sucess' })

    }

}