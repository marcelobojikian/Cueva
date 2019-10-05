module.exports = {

    requiredFirstStep(req, res) {

        const user_id = req.headers.user_id
        const id = user_id ? user_id.split('.').join('\\.') : null

        const { body, storeUser } = req
        const { value } = body

        if (storeUser.has(id)) {
            const userInfo = storeUser.get(id)

            userInfo.requiredFirstStep = value

            storeUser.set(id, userInfo)

            return res.json({ status: "ok" })

        }

    }
}

