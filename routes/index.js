var express = require('express');
var router = express.Router();

var dburl = 'mongodb://localhost:27017/cashflow';

var mongoose = require('mongoose');
mongoose.connect(dburl);

var Expense = require('./expense');

//Logging middleware
router.use(function(req, res, next) {
    console.log('something is happening');
    next();
});

router.route('/expenses')
    .post(function(req, res) {
        var expense = new Expense();
        expense.name = req.body.name;
        expense.amount = req.body.amount;

        expense.save(function(err) {
            if (err){
                res.send(err)
            }

            res.json({message: 'Expense Created'})
        })
    })
    .get(function(req, res) {
        Expense.find(function(err, expenses) {
            if (err){
                res.send(err);
            }

            res.json(expenses)
        })
    });

router.route('/expenses/:expense_id')
    .get(function(req, res){
        Expense.findById(req.params.expense_id, function(err, expense) {
            if (err){
                res.send(err);
            }

            res.json(expense)
        })
    })

    .put(function(req, res){
        Expense.findById(req.params.expense_id, function(err, expense) {
            if (err){
                res.send(err)
            }

            expense.name = req.body.name;
            expense.amount = req.body.amount;

            expense.save(function(err){
                if (err){
                    res.send(err)
                }

                res.json({'message': 'Expense updated'})
            });
        });
    })

    .delete(function(req, res){
        Expense.remove({
            _id: req.params.id
        }, function(err, expense){
            if (err){
                res.send(err)
            }

            res.json({'message': 'Expense Deleted'})
        })
    });

module.exports = router;
