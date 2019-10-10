const mongoose = require('mongoose')

const CashierSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    initial: Number,
    balance: Number
},
{
    timestamps: true,
})

module.exports = mongoose.model('Cashier', CashierSchema);