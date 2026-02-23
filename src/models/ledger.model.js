const mongoose = require('mongoose');

const ledgerschema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'account is required for a ledger entry'],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, 'amount is required for a ledger entry'],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, 'transaction is required for a ledger entry'],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ['DEBIT', 'CREDIT'],
            message: "type can be either DEBIT or CREDIT",
        },
        required: [true, 'type is required for a ledger entry'],
        immutable: true
    }
})

function preventledgermodification() {
    throw new Error('ledger entries cannot be modified or deleted')
}

ledgerschema.pre('findOneAndUpdate', preventledgermodification)
ledgerschema.pre('updateOne', preventledgermodification)
ledgerschema.pre('deleteOne', preventledgermodification)
ledgerschema.pre('remove', preventledgermodification)
ledgerschema.pre('deleteMany', preventledgermodification)
ledgerschema.pre('updateMany', preventledgermodification)
ledgerschema.pre('findOneAndDelete', preventledgermodification)
ledgerschema.pre('findOneAndReplace', preventledgermodification)

const ledgermodel = mongoose.model('Ledger', ledgerschema)
module.exports = ledgermodel