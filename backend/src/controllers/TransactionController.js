module.exports = {

    withdraw(req, res) {

        const cashierName = req.params.name;

        const user_id = req.headers.user_id
        const id = user_id ? user_id.replace(".", "\\.") : null

        const { storeApp, body } = req;
        const { value } = body

        if (id && storeApp.has(id)) {
            const userInfo = storeApp.get(id)

            const cashierArray = userInfo.cashiers
            const cashier = cashierArray.find(({ name }) => { return name === cashierName });

            if (!cashier) {
                return res.json({ status: 'Cashier not exist' })
            } else {

                const transactions = !userInfo.transactions ? [] : userInfo.transactions;

                const newTransactions = [
                    ...transactions,
                    {
                        owner: user_id,
                        action: 'withdraw',
                        value: value
                    }
                ]

                userInfo.transactions = newTransactions
                
                console.log('Param:', cashierName, 'balance now:', cashier.balance, 'withdraw:', value)
                //userInfo.cashiers = cashiers
                storeApp.set(id, userInfo);

            }
        } else {
            return res.json({ status: 'User not exist' })
        }

        return res.json({ status: 'ok' })

    },

    deposit(req, res) {

        const cashierName = req.params.name;

        const user_id = req.headers.user_id
        const id = user_id ? user_id.split('.').join('\\.') : null

        const { storeApp, body } = req;
        const { value } = body

        if (id && storeApp.has(id)) {
            const userInfo = storeApp.get(id)

            const cashierArray = userInfo.cashiers
            const cashier = cashierArray.find(({ name }) => { return name === cashierName });

            if (!cashier) {
                return res.json({ status: 'Cashier not exist' })
            } else {

                const transactions = !userInfo.transactions ? [] : userInfo.transactions;

                const newTransactions = [
                    ...transactions,
                    {
                        owner: user_id,
                        action: 'deposit',
                        value: value
                    }
                ]

                userInfo.transactions = newTransactions

                console.log('Param:', cashierName, 'balance now:', cashier.balance, 'deposit:', value)
                //userInfo.cashiers = cashiers
                storeApp.set(id, userInfo);

            }
        } else {
            return res.json({ status: 'User not exist' })
        }

        return res.json({ status: 'ok' })

    }

}