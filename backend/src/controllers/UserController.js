const bcrypt = require("bcryptjs");

module.exports = {

    async register(req, res) {

        const { storeUser } = req;

        try {

            const user = req.body;
            const mail = user.mail.split('.').join('\\.')

            if (storeUser.has(user.mail)) {
                return res.status(400).json({ error: "User already exists" });
            }

            const password = await bcrypt.hash(user.password, 8);

            storeUser.set(mail, { password, requiredFirstStep: true })
            storeUser.save();

            return res.json({ user });
        } catch (err) {
            return res.status(400).json({ error: "User registration failed" });
        }

    },

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

