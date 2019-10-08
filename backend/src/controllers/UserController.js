const bcrypt = require("bcryptjs")
const App = require('../models/App')
const User = require('../models/User')

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

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

    },

    async show(req, res) {

        const { userId } = req

        const userInfo = await App.findOne({ user: userId })
            .populate({ path: 'user', select: 'mail requiredFirstStep' })
            .populate({ path: 'flatmates', select: 'mail' })
            .exec();

        return res.json(userInfo)

    },

    async update(req, res) {

        const { userId } = req
        const { requiredFirstStep } = req.body

        const userInfo = await User.findById(userId)

        await userInfo.updateOne({ requiredFirstStep: requiredFirstStep })

        return res.json({ message: "Sucess" })

    }
}

