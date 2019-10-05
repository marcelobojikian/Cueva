module.exports = {

    store(req, res) {

        const user_id = req.headers.user_id
        const id = user_id ? user_id.split('.').join('\\.') : null

        const { storeApp, body } = req;
        const { cashiers } = body

        if (id && storeApp.has(id)) {
            const userInfo = storeApp.get(id)

            userInfo.cashiers = cashiers
            storeApp.set(id, userInfo);
        } else {
            res.json({ status: 'User not exist' })
        }

        res.json({ status: 'ok' })

    }

}