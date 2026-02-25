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

async function getallaccountscontroller(req,res,next){
    const accounts = await accountmodel.find({user:req.user._id})
    return res.status(200).json({
        message:"Accounts fetched successfully",
        accounts
    })
}

async function getaccountbalancecontroller(req,res,next){
    const {id} = req.params
    const account = await accountmodel.findOne({_id:id,user:req.user._id})

    if(!account){
        return res.status(404).json({message:"Account not found"})
    }

    const balance = await account.getbalance()

    return res.status(200).json({
        message:"Account balance fetched successfully",
        balance
    })
}

module.exports = {createaccountcontroller,getallaccountscontroller,getaccountbalancecontroller}