module.exports = {

    login(req, res) {

        const { body, storeUser } = req
        const user = body

        if (storeUser.has(user.mail)) {

            const userInfo = storeUser.get(user.mail)
            const { password, invitedBy, requiredFirstStep } = userInfo

            if (password == user.password) {
                return res.json({ 
                    status: "ok", 
                    invitedBy, 
                    requiredFirstStep })

            } else {
                return res.json({ status: "password invalido" })
            }
        } else {
            return res.json({ status: "usuario invalido" })
        }

    }
}

