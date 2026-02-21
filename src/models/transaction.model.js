const mongoose = require('mongoose')

const transactionschema = new mongoose.Schema({
    fromaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:[true,'from account is required for a transaction'],
        index:true
    },
    toaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:[true,'to account is required for a transaction'],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['PENDING','COMPLETED','FAILED','REVERSED'],
            message:"status can be either PENDING, COMPLETED, FAILED or REVERSED",
        },
        default:'PENDING'
    },
    amount:{
        type:Number,
        required:[true,'amount is required for a transaction'],
        min:[0,'amount cant be negative']
    },
    idempotencykey:{
        type:String,
        required:[true,'idempotency key is required for a transaction'],
        index:true,
        unique:true,
    }
},{
    timestamps:true
})

const transactionmodel = mongoose.model('Transaction', transactionschema)
module.exports = transactionmodel