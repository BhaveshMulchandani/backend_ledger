const transactionmodel = require('../models/transaction.model')
const accountmodel = require('../models/account.model')
const ledgermodel = require('../models/ledger.model')
const usermodel = require('../models/user.model')
const mongoose = require('mongoose')


/**
 * - create new transaction
 *  the 10 step transfer flow:
 *  1. validate request
 *  2. validate idempotency key
 *  3. check account status
 *  4. derive sender balance from ledger 
 *  5. create transaction (PENDING)
 *  6. create DEBIT ledger entry
 *  7. create CREDIT ledger entry
 *  8. mark transaction COMPLETED
 *  9. commit mongodb session
 *  10. send email notification
*/

async function createtransaction(req, res) {

    const { fromaccount, toaccount, amount, idempotencykey } = req.body

    if (!fromaccount || !toaccount || !amount || !idempotencykey) {
        return res.status(400).json({ message: "fromaccount, toaccount, amount and idempotencykey are required" })
    }

    const fromuseraccount = await accountmodel.findOne({ _id: fromaccount })
    const touseraccount = await accountmodel.findOne({ _id: toaccount })

    if (!fromuseraccount || !touseraccount) {
        return res.status(404).json({ message: "fromaccount or toaccount not found" })
    }


    const istransactionexist = await transactionmodel.findOne({ idempotencykey })

    if (istransactionexist) {
        if (istransactionexist.status === "COMPLETED") {
            return res.status(200).json({ message: "transaction completed successfully", transaction: istransactionexist })
        }

        if (istransactionexist.status === "PENDING") {
            return res.status(200).json({ message: "transaction is still processing" })
        }

        if (istransactionexist.status === "FAILED") {
            return res.status(500).json({ message: "transaction failed, please try again" })
        }


        if (istransactionexist.status === "REVERSED") {
            return res.status(500).json({ message: "transaction was reversed, please retry" })
        }

    }

    if (fromuseraccount.status !== "ACTIVE" || touseraccount.status !== "ACTIVE") {
        return res.status(400).json({ message: "fromaccount or toaccount is not active" })
    }

    const balance = await fromuseraccount.getbalance()

    if (balance < amount) {
        return res.status(400).json({ message: `insufficient balance. current balance is ${balance}. requested amount is ${amount}` })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    let transaction

    try {
        transaction = (await transactionmodel.create([{
            fromaccount,
            toaccount,
            amount,
            idempotencykey,
            status: "PENDING"
        }], { session }))[0]

        const debitledgerentry = await ledgermodel.create([{
            account: fromaccount,
            amount,
            type: "DEBIT",
            transaction: transaction._id
        }], { session })

        // await (() => {
        //     return new Promise((resolve) => setTimeout(resolve, 15 * 1000))
        // })()

        const creditledgerentry = await ledgermodel.create([{
            account: toaccount,
            amount,
            type: "CREDIT",
            transaction: transaction._id
        }], { session })

        await transactionmodel.findOneAndUpdate({ _id: transaction._id }, { status: "COMPLETED" }, { session })
        await session.commitTransaction()
        session.endSession()

    } catch (error) {
        return res.status(400).json({ message: "transaction is pending due to some issue, please retry after some time" })
    }
}

async function createinitialfundtransaction(req, res) {
    const { toaccount, amount, idempotencykey } = req.body

    if (!toaccount || !amount || !idempotencykey) {
        return res.status(400).json({ message: "toaccount, amount and idempotencykey are required" })
    }

    const touseraccount = await accountmodel.findOne({ _id: toaccount })

    if (!touseraccount) {
        return res.status(404).json({ message: "toaccount not found" })
    }

    const fromuseraccount = await accountmodel.findOne({ user: req.user._id })

    if (!fromuseraccount) {
        return res.status(404).json({ message: "system account not found" })
    }

    const session = await mongoose.startSession()
    session.startTransaction()


    const transaction = new transactionmodel({
        fromaccount: fromuseraccount._id,
        toaccount,
        amount,
        idempotencykey,
        status: "PENDING"
    })

    const debitledgerentry = await ledgermodel.create([{
        account: fromuseraccount._id,
        amount,
        type: "DEBIT",
        transaction: transaction._id
    }], { session })

    const creditledgerentry = await ledgermodel.create([{
        account: toaccount,
        amount,
        type: "CREDIT",
        transaction: transaction._id
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({ message: "initial fund transaction created successfully", transaction })
}

module.exports = {
    createtransaction,
    createinitialfundtransaction
}