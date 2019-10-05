module.exports = {

    // INDEX SHOW STORE UPDATE DELETE

    store(req, res) {

        const { storeUser, userId } = req
        const { guests } = req.body

        guests.forEach((guest) => {

            const mailGuest = guest.mail

            if (!storeUser.has(mailGuest)) {
                const mail = mailGuest.split('.').join('\\.')
                storeUser.set(mail, { invitedBy: [{ username: userId }], requiredFirstStep: false })
            } else {

                const guestInfo = storeUser.get(mailGuest)
                const invites = !guestInfo.invitedBy ? [] : guestInfo.invitedBy

                const exist = invites.find(({ username }) => { return username === userId });

                if (!exist) {

                    const newInvites = [
                        ...invites,
                        { username: userId }
                    ]

                    const mail = mailGuest.split('.').join('\\.')
                    storeUser.set(mail, { invitedBy: [newInvites] })
                }

            }

        });

        return res.json({ message: 'Sucess' })

    }

}
