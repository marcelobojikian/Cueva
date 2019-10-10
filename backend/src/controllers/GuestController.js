const bcrypt = require("bcryptjs")
const User = require('../models/User')

module.exports = {

    // INDEX SHOW STORE UPDATE DELETE

    async update(req, res) {

        const { userLogged } = req
        const { username, password, requiredStepGuest } = req.body

        const passwordCrypt = await bcrypt.hash(password, 8)

        await userLogged.updateOne({ username, password: passwordCrypt, requiredStepGuest: requiredStepGuest })

        return res.json({ message: "Sucess" })
    },

    async store(req, res) {

        const { userLogged } = req
        const { guests, password } = req.body

        const emails = guests.map((guest) => { return guest.mail })
        const guestsInDB = await User.find({ mail: { $in: emails } })
        guestsInDB.forEach(async (guest) => {
            if (!guest.invitedBy.includes(userLogged.id)) {
                console.log('Update', guest.mail, ', invited by', userLogged.mail)
                guest.invitedBy.push(userLogged)
                await guest.save()
            }
        })

        const passwordCrypt = await bcrypt.hash(password, 8);

        const mailsInDB = guestsInDB.map((guest) => { return guest.mail })
        emails.forEach(async (mail) => {
            if (!mailsInDB.includes(mail)) {
                console.log('Create new user with', mail, 'invited by', userLogged.mail)
                const guest = await User.create({ mail, password: passwordCrypt, requiredStepGuest: true, requiredFirstStep: false })
                guest.invitedBy.push(userLogged)
                await guest.save()
            }
        })

        return res.json({ message: 'Sucess' })

    }

}
