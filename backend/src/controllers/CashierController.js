module.exports = {

    store(req, res) {

        const { storeApp, userId } = req
        const { cashiers } = req.body

        const id = userId.split('.').join('\\.')

        const userInfo = storeApp.get(id)

        userInfo.cashiers = cashiers
        storeApp.set(id, userInfo);

        res.json({ message: 'Sucess' })

    }

}