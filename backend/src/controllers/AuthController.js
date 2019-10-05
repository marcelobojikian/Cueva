const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {

    async authenticate(req, res) {

        const { storeUser } = req;

        try {

            const user = req.body;
            const mail = user.mail.split('.').join('\\.')

            if (!storeUser.has(mail)) {
                return res.status(400).json({ error: "User already exists" });
            }

            const userInfo = storeUser.get(mail)

            const correct = await bcrypt.compare(user.password, userInfo.password);

            if (!correct) {
                return res.status(400).json({ error: "Invalid password" });
            }

            const { invitedBy, requiredFirstStep } = userInfo

            return res.json({
                mail: user.mail,
                invitedBy,
                requiredFirstStep,
                token: jwt.sign({ id: user.mail }, "secret", { expiresIn: 86400 })
            });

        } catch (err) {
            return res.status(400).json({ error: "User authentication failed" });
        }

    },

    async me(req, res) {
        try {
            const { storeUser, userId } = req;
            const mail = userId.split('.').join('\\.')

            const userInfo = storeUser.get(mail)

            return res.json({ mail: userId, requiredFirstStep: userInfo.requiredFirstStep });
        } catch (err) {
            return res.status(400).json({ error: "Can't get user information" });
        }
    }

}

