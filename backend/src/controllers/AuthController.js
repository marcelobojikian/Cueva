const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User')

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

    async show(req, res) {

        try {

            const { mail, password } = req.body

            const userInfo = await User.findOne({ mail })
            if (userInfo == null) {
                return res.status(400).json({ message: "User not exists" });
            }

            //console.log(mail,'user.password:', password, 'userInfo.password:', userInfo.password )

            const correct = await bcrypt.compare(password, userInfo.password);

            if (!correct) {
                return res.status(400).json({ message: "Invalid password" });
            }

            return res.json({
                token: jwt.sign({ id: userInfo.id }, "secret", { expiresIn: 86400 })
            });

        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "User authentication failed" });
        }

    }

}

