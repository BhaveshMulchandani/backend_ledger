const mongoose = require('mongoose')

const accountschema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'Account must be associated with a user'],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['ACTIVE','FROZEN','CLOSED'],
            message:"status can be either ACTIVE, FROZEN or CLOSED",
        },
        default:'ACTIVE'
    },
    currency:{
        type:String,
        required:[true,'cureency is required for creating an account'],
        default:"INR"
    },
},{
    timestamps:true
})

accountschema.index({user:1,status:1})

const accountmodel = mongoose.model('Account',accountschema)
module.exports = accountmodel
