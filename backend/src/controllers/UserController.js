const bcrypt = require("bcryptjs");

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

    async store(req, res) {

        try {

            const { storeUser } = req;

            const user = req.body;
            const mail = user.mail.split('.').join('\\.')

            if (storeUser.has(user.mail)) {
                return res.status(400).json({ message: "User already exists" });
            }

            const password = await bcrypt.hash(user.password, 8);

            storeUser.set(mail, { password, requiredFirstStep: true })
            storeUser.save();

            return res.json({ message: "Sucess" });

        } catch (err) {
            return res.status(400).json({ message: "User registration failed" });
        }

    },

    update(req, res) {

        const { storeUser, userId } = req
        const { requiredFirstStep } = req.body

        const id = userId.split('.').join('\\.')
        const userInfo = storeUser.get(id)

        userInfo.requiredFirstStep = requiredFirstStep

        storeUser.set(id, userInfo)

        return res.json({ message: "Sucess" })

    }
}

