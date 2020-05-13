const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    score: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'USER'
    }
})

module.exports = mongoose.model('User', UserSchema);