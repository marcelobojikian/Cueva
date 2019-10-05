module.exports = {

    store(req, res) {

        const { storeApp, userId } = req
        const { flatmates } = req.body

        const id = userId.split('.').join('\\.')

        const userInfo = storeApp.get(id)

        userInfo.flatmates = flatmates
        storeApp.set(id, userInfo);

        return res.json({ message: 'Sucess' })

    }

}