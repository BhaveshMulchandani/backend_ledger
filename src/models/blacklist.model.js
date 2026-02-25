const mongoose = require('mongoose');

const tokenblacklistschema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to blacklist"],
        unique: [true, "token is already blacklisted"]
    },
}, {
    timestamps: true
})

//ttl = time to leave 

tokenblacklistschema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 }) //blacklist will be removed after 3 days

const tokenblacklistmodel = mongoose.model('TokenBlacklist', tokenblacklistschema)
module.exports = tokenblacklistmodel