const mongoose = require('mongoose')
const ledgermodel = require('./ledger.model')

const accountschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Account must be associated with a user'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVE', 'FROZEN', 'CLOSED'],
            message: "status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: 'ACTIVE'
    },
    currency: {
        type: String,
        required: [true, 'cureency is required for creating an account'],
        default: "INR"
    },
}, {
    timestamps: true
})

accountschema.index({ user: 1, status: 1 })

accountschema.methods.getbalance = async function () {
    const balancedata = await ledgermodel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totaldebit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0]
                    }
                },
                totalcredit:{
                    $sum: {
                        $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalcredit", "$totaldebit"] }
            }
        }
    ])

    return balancedata.length === 0 ? 0 : balancedata[0].balance
}

const accountmodel = mongoose.model('Account', accountschema)
module.exports = accountmodel
