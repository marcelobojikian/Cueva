const User = require('../models/User')

module.exports = {

    // INDEX SHOW STORE UPDATE DELETE

    async store(req, res) {

        const { userLogged } = req
        const { guests } = req.body

        const emails = guests.map((guest) => { return guest.mail })
        const guestsInDB = await User.find({ mail: { $in: emails } })
        guestsInDB.forEach(async (guest) => {
            if (!guest.invitedBy.includes(userLogged.id)) {
                console.log('Update',guest.mail,', invited by', userLogged.mail )
                guest.invitedBy.push(userLogged)
                await guest.save()
            }
        })

        const mailsInDB = guestsInDB.map((guest) => { return guest.mail })
        emails.forEach(async (mail) => {
            if(!mailsInDB.includes(mail)){
                console.log('Create new user with', mail, 'invited by', userLogged.mail)
                const guest = await User.create({ mail, requiredFirstStep: false })
                guest.invitedBy.push(userLogged)
                await guest.save()
            }
        })

        return res.json({ message: 'Sucess' })

    }

}
