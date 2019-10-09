const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: String,
    cashier: String,
    action: String,
    value: Number
},
{
    timestamps: true,
})

module.exports = mongoose.model('Transaction', TransactionSchema);