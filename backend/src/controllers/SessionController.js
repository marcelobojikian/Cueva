module.exports = {

    show(req, res) {

        const { storeUser } = req;

        res.json(storeUser.get())
    },

    store(req, res) {

        const { storeUser } = req;

        const user = req.body;

        const mail = user.email.split('.').join('\\.')

        if (!storeUser.has(user.email)) {

            storeUser.set(mail, { password: user.password, requiredFirstStep: true })
            storeUser.save();

        } else {

            const userInfo = storeUser.get(mail)    
            userInfo.password = user.password
            storeUser.set(mail, userInfo)
        }

        res.json({ status: 'ok' })

    },

}