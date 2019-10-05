const path = require('path')
const storeApp = require('data-store')('storeApp', { path: path.resolve(__dirname, '..', '..', './database.json') });
const storeUser = require('data-store')('storeUser', { path: path.resolve(__dirname, '..', '..', './users.json') });

module.exports = {

    async injectDatabase(req, res, next) {
        req.storeApp = storeApp;
        req.storeUser = storeUser;
        return next();
    },

    async prepareUser(req, res, next){

        const { userId } = req

        const id = userId.split('.').join('\\.')
    
        if (!storeUser.has(id)) {
            return res.status(400).json({ message: 'User not exist' })
        }

        if (!storeApp.has(id)) {
            storeApp.set(id, {})
        }

        return next();
    }

}