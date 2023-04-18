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
        console.log(req.user._id)
        let items = []
        items = await TransactionItem.find({ userId: req.user._id }).sort({ amount: 1, date: 1 })
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

    }
)

router.post('/transaction/updateTransactionItem',
    isLoggedIn,
    async (req, res, next) => {

    }
)

router.get('/transaction/groupByCategory',
    isLoggedIn,
    async (req, res, next) => {

    }
)

router.get('/transaction/sortByCategory',
    isLoggedIn,
    async (req, res, next) => {

    }
)

router.get('/transaction/sortByAmount',
    isLoggedIn,
    async (req, res, next) => {

    }
)

router.get('/transaction/sortByDescription',
    isLoggedIn,
    async (req, res, next) => {

    }
)

router.get('/transaction/sortByDate',
    isLoggedIn,
    async (req, res, next) => {

    }
)

module.exports = router;