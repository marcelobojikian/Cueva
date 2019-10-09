const User = require('../models/User')
const Dashboard = require('../models/Dashboard')

module.exports = {

    async existUser(req, res, next){

        const { userId } = req

        const user = await User.findById(userId)
    
        if (user == null) {
            return res.status(400).json({ message: 'User not exist' })
        }

        req.userLogged = user;

        const dashboard = await Dashboard.findOne({user: userId})

        if(dashboard == null){
            await Dashboard.create({ user: user })
        }

        return next();
    }

}