module.exports = {

    store(req, res) {

        const { storeApp, userId } = req

        const {cashierName, action} = req.params
        const { value } = req.body

        if (action != 'deposit' && action != 'withdraw') {
            return res.status(400).json({ message: 'Action invalid' })
        }

        const id = userId.split('.').join('\\.')

        const userInfo = storeApp.get(id)

        const cashierArray = userInfo.cashiers
        const cashier = cashierArray.find(({ name }) => { return name === cashierName });

        if (!cashier) {
            return res.status(400).json({ message: 'Cashier not exist' })
        }

        const transactions = !userInfo.transactions ? [] : userInfo.transactions;

        const newTransactions = [
            ...transactions,
            {
                owner: userId,
                action: action,
                value: value
            }
        ]

        userInfo.transactions = newTransactions
        storeApp.set(id, userInfo);

        return res.json({ message: 'Sucess' })

    }

}