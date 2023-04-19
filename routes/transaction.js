/*
  transaction.js -- Router for the transaction
*/

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TransactionItem = require('../models/TransactionItem');

/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/transaction/',
    isLoggedIn,
    async (req, res, next) => {
        const sortBy = req.query.sortBy
        console.log("User id: " + JSON.stringify(req.user._id))
        console.log((JSON.stringify(sortBy) == undefined ? "No Sorting" : "Sorting by " + JSON.stringify(sortBy)))
        let items = []
        if (sortBy == "category") {
            items = await TransactionItem.find({ userId: req.user._id }).sort({ category: 1 })
        }
        else if (sortBy == "amount") {
            items = await TransactionItem.find({ userId: req.user._id }).sort({ amount: 1 })
        }
        else if (sortBy == "description") {
            items = await TransactionItem.find({ userId: req.user._id }).sort({ description: 1 })
        }
        else if (sortBy == "date") {
            items = await TransactionItem.find({ userId: req.user._id }).sort({ date: 1 })
        }
        else {
            items = await TransactionItem.find({ userId: req.user._id })
        }
        res.render('transaction', { items })
    }
)

router.post('/transaction/',
    isLoggedIn,
    async (req, res, next) => {
        const transaction = new TransactionItem(
            {
                description: req.body.description,
                amount: parseInt(req.body.amount),
                category: req.body.category,
                date: new Date(req.body.date),
                userId: req.user._id
            }
        )
        await transaction.save();
        res.redirect('/transaction')
    }
)

router.get('/transaction/remove/:itemId',
    isLoggedIn,
    async (req, res, next) => {
        await TransactionItem.deleteOne({ _id: req.params.itemId })
        res.redirect('/transaction')
    }
)

router.get('/transaction/edit/:itemId',
    isLoggedIn,
    async (req, res, next) => {
        console.log("Editing " + req.params.itemId)
        const item = await TransactionItem.findById(req.params.itemId)
        res.locals.item = item
        res.render('edit')
    }
)

router.post('/transaction/updateTransactionItem',
    isLoggedIn,
    async (req, res, next) => {
        const { itemId, description, amount, category } = req.body
        const date = new Date(JSON.stringify(req.body.date))
        await TransactionItem.findOneAndUpdate(
            { _id: itemId },
            { $set: { description, amount, category, date } }
        )
        res.redirect('/transaction')
    }
)

router.get('/transaction/groupByCategory',
    isLoggedIn,
    async (req, res, next) => {
        let results =
            await TransactionItem.aggregate(
                [
                    {
                        $group: {
                            _id: '$category',
                            total: { $sum: '$amount' },
                        }
                    }
                ]
            )
        res.render('summarize', { results })
    }
)

module.exports = router;