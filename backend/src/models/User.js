const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    mail: String,
    password: String,
    requiredFirstStep: Boolean,
    invitedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model('User', UserSchema);