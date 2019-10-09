const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
    },
    password: String,
    requiredFirstStep: Boolean,
    invitedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', UserSchema);