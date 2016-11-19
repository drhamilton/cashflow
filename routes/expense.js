let mongoose = require('mongoose');
let Expense = require('../model/expense');

function getExpenses(req, res) {
    let query = Expense.find({});
    query.exec((err, expenses) => {
        if (err){
            res.send(err);
        }

        res.json(expenses)
    })
}

function postExpense(req, res){
    var newExpense = new Expense(req.body);

    newExpense.save((err, expense) => {
        if (err){
            res.send(err);
        }
        else {
            res.json({message: 'Expense Added', expense});
        }
    })
}

function getExpense(req, res){
    Expense.findById(req.params.id, (err, expense) => {
        if (err){
            res.send(err);
        }

        res.json(expense);
    })
}

function deleteExpense(req, res){
    Expense.remove({ _id: req.params.id }, (err, result) => {
        res.json({ message: "Expense removed", result });
    })
}

function updateExpense(req, res){
    Expense.findById(req.params.id, (err, expense) => {
        if (err){
            res.send(err)
        }

        Object.assign(expense, req.body).save((err, expense) => {
            if (err){
                res.send(err);
            }
            else {
                res.json({ message: 'Expense updated', expense })
            }
        })
    })
}

module.exports = { getExpenses, postExpense, getExpense, deleteExpense, updateExpense };