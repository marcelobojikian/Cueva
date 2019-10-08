const User = require('../models/User')

module.exports = {

    // INDEX SHOW STORE UPDATE DELETE

    async store(req, res) {

        const { userId } = req
        const { guests } = req.body

        const userInfo = await User.findById(userId)

        const emails = guests.map((guest) => { return guest.mail })
        const guestsInDB = await User.find().where('mail').in(emails)
        guestsInDB.forEach(async (guest) => {
            if (!guest.invitedBy.includes(userId)) {
                console.log('Update',guest.mail,', invited by', userInfo.mail )
                guest.invitedBy.push(userInfo)
                await guest.save()
            }
        })

        const mailsInDB = guestsInDB.map((guest) => { return guest.mail })
        emails.forEach(async (mail) => {
            if(!mailsInDB.includes(mail)){
                console.log('Create new user with', mail, 'invited by', userInfo.mail)
                const guest = await User.create({ mail, requiredFirstStep: false })
                guest.invitedBy.push(userInfo)
                await guest.save()
            }
        })

        return res.json({ message: 'Sucess' })

    }

}
