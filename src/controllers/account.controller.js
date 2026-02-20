const accountmodel = require('../models/account.model')

async function createaccountcontroller(req,res,next){

    const user = req.user

    const account = await accountmodel.create({
        user:user._id
    })

    return res.status(201).json({
        message:"Account created successfully",
        account
    })
}


module.exports = {createaccountcontroller}