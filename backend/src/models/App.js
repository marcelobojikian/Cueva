const mongoose = require('mongoose')

const AppSchema = new mongoose.Schema({
    transactions: [
        {
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            action: String,
            value: Number
        }
    ],
    cashiers: [
        {
            name: String,
            balance: Number
        }
    ],
    flatmates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('App', AppSchema);