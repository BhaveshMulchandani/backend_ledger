const usermodel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const tokenblacklistmodel = require('../models/blacklist.model')

async function userregistercontroller(req, res, nxt) {

    const { email, name, password } = req.body

    const isexist = await usermodel.findOne({ email: email })

    if (isexist) {
        return res.status(422).json({ message: "user already exist", status: "fail" })
    }

    const user = await usermodel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })

    res.cookie('token', token)

    res.status(201).json({ user: { _id: user._id, email: user.email, name: user.name }, token })

}

async function userlogincontroller(req, res, nxt) {

    const { email, password } = req.body

    const user = await usermodel.findOne({ email: email }).select('+password')

    if (!user) {
        return res.status(404).json({ message: "user not found", status: "fail" })
    }

    const isvalid = await user.comparePassword(password)

    if (!isvalid) {
        return res.status(401).json({ message: "invalid credentials", status: "fail" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token', token)

    res.status(200).json({ user: { _id: user._id, email: user.email, name: user.name }, token })

}

async function userlogoutcontroller(req, res, nxt) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(400).json({ message: "token is required to logout", status: "fail" })
    }

    await tokenblacklistmodel.create({ token })

    res.clearCookie('token')

    res.status(200).json({ message: "user logged out successfully" })

}

module.exports = { userregistercontroller, userlogincontroller, userlogoutcontroller }