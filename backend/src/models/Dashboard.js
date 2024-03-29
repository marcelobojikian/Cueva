const mongoose = require('mongoose')

const DashboardSchema = new mongoose.Schema({
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    cashiers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cashier'
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
},
{
    timestamps: true,
})

module.exports = mongoose.model('Dashboard', DashboardSchema);