module.exports = {

    store(req, res) {

        const user_id = req.headers.user_id
        const id = user_id ? user_id.split('.').join('\\.') : null

        const { storeApp, storeUser, body } = req;
        const { flatmates } = body

        if (id && storeUser.has(id)) {

            if (!storeApp.has(id)) {
                storeApp.set(id, {})
            }

            const userInfo = storeApp.get(id)

            userInfo.flatmates = flatmates
            storeApp.set(id, userInfo);

            flatmates.forEach((flatmate) => {

                if (storeUser.has(flatmate.username)) {
                    const userInvitedInfo = storeUser.get(flatmate.username)

                    const invites = !userInvitedInfo.invitedBy ? [] : userInvitedInfo.invitedBy;

                    const exist = invites.find(({ username }) => { return username === user_id });

                    if (!exist) {

                        const newInvites = [
                            ...invites,
                            { username: user_id }
                        ]

                        const mail = flatmate.username.split('.').join('\\.')
                        storeUser.set(mail, { invitedBy: [newInvites] })
                    }

                } else {
                    const mail = flatmate.username.split('.').join('\\.')
                    storeUser.set(mail, { invitedBy: [{ username: user_id }], requiredFirstStep: false })
                }
            });

        } else {
            return res.json({ status: 'User not exist' })
        }

        return res.json({ status: 'ok' })
    }

}