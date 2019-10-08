const User = require('../models/User')
const App = require('../models/App')

module.exports = {

    async existUser(req, res, next){

        const { userId } = req

        const user = await User.findById(userId)
    
        if (user == null) {
            return res.status(400).json({ message: 'User not exist' })
        }

        const userAppInfo = await App.findOne({user: userId})

        if(userAppInfo == null){
            await App.create({ user: user })
        }

        return next();
    }

}