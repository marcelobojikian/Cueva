const User = require('../models/User')
const App = require('../models/App')

module.exports = {

    async store(req, res) {

        const { userId } = req
        const { flatmates } = req.body

        const emails = flatmates.map((flatmate) => { return flatmate.mail })

        const flatmatesObj = await User.find().where('mail').in(emails)

        await App.findOneAndUpdate({ user: userId }, { $set: { flatmates: flatmatesObj } })

        return res.json({ message: 'Sucess' })

    }

}