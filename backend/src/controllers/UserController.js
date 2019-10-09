const bcrypt = require("bcryptjs")
const User = require('../models/User')

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

    async show(req, res) {

        const { userLogged } = req

        return res.json(userLogged)

    },

    async update(req, res) {

        const { userLogged } = req
        const { requiredFirstStep } = req.body

        await userLogged.updateOne({ requiredFirstStep: requiredFirstStep })

        return res.json({ message: "Sucess" })

    },

    async store(req, res) {

        try {

            const { mail, password } = req.body;

            const userInfo = await User.findOne({ mail })
            if (userInfo != null) {
                return res.status(400).json({ message: "User already exists" });
            }

            const passwordCrypt = await bcrypt.hash(password, 8);

            await User.create({ mail, password: passwordCrypt, requiredFirstStep: true })

            return res.json({ message: "Sucess" });

        } catch (err) {
            return res.status(400).json({ message: "User registration failed" });
        }

    }
}

