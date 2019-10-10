const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cashier'
    },
    status: String,
    action: String,
    value: Number
},
{
    timestamps: true,
})

module.exports = mongoose.model('Transaction', TransactionSchema);