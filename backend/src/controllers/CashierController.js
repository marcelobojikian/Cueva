const App = require('../models/App')

module.exports = {

    async store(req, res) {

        const { userId } = req
        const { cashiers } = req.body

        await App.update({user: userId}, {$set: {cashiers}})

        res.json({ message: 'Sucess' })

    }

}