const usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const tokenblacklistmodel = require('../models/blacklist.model')

async function authmiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const isblacklisted = await tokenblacklistmodel.findOne({ token })

    if (isblacklisted) {
        return res.status(401).json({ message: "Unauthorized, token is invalid" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await usermodel.findById(decoded.id)

        req.user = user

        return next()

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }

}

async function authsystemusermiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const isblacklisted = await tokenblacklistmodel.findOne({ token })

    if (isblacklisted) {
        return res.status(401).json({ message: "Unauthorized, token is invalid" })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await usermodel.findById(decoded.id).select('+systemuser')

        if (!user.systemuser) {
            return res.status(403).json({ message: "Forbidden" })
        }

        req.user = user

        return next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

module.exports = { authmiddleware, authsystemusermiddleware }