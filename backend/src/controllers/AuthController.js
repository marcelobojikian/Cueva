const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// INDEX, SHOW, STORE, UPDATE, DELETE
module.exports = {

    async show(req, res) {

        const { storeUser } = req;

        try {

            const user = req.body;
            const mail = user.mail.split('.').join('\\.')

            if (!storeUser.has(mail)) {
                return res.status(400).json({ message: "User already exists" });
            }

            const userInfo = storeUser.get(mail)

            const correct = await bcrypt.compare(user.password, userInfo.password);

            if (!correct) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const { invitedBy, requiredFirstStep } = userInfo

            return res.json({
                mail: user.mail,
                invitedBy,
                requiredFirstStep,
                token: jwt.sign({ id: user.mail }, "secret", { expiresIn: 86400 })
            });

        } catch (err) {
            return res.status(400).json({ message: "User authentication failed" });
        }

    }

}

