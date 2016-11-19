process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Expense = require('../model/expense');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('Expenses', () => {
    beforeEach((done) => {
        Expense.remove({}, (err) => {
            done();
        })
    });

    describe('/GET expense', () => {
        it('it should GET all the expenses', (done) => {
            chai.request(server)
                .get('/expense')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        })
    });

    describe('/POST expense', () => {
        it('it should not POST the expense without amount field', (done) => {
            let expense = {
                name: 'Groceries',
                category: 'Groceries'
            };

            chai.request(server)
                .post('/expense')
                .send(expense)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('amount');
                    res.body.errors.amount.should.have.property('kind').eql('required');
                    done();
                });
        });

        it('should POST an expense', (done) => {
            let expense = {
                name: 'Beer + Avocados',
                category: 'Groceries',
                amount: '20'
            };

            chai.request(server)
                .post('/expense')
                .send(expense)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Expense Added');
                    res.body.expense.should.have.property('amount');
                    res.body.expense.should.have.property('name');
                    res.body.expense.should.have.property('category');
                    done();
                })
        })
    });

    describe('/GET/:id expense', () => {
        it('should get the expense we ask for', (done) => {
            let expense = new Expense({
                'name': 'Fig food',
                'category': 'fig',
                'amount': 100
            });
            expense.save((err, res) => {
                chai.request(server)
                    .get('/expense/' + expense.id)
                    .send(expense)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('amount');
                        res.body.should.have.property('name');
                        res.body.should.have.property('category');
                        res.body.should.have.property('_id').eql(expense.id)
                        done();
                    });
            });
        })
    })

    describe('/PUT/:id expense', () => {
        it('should update the expense given the id', (done) => {
            let expense = new Expense({
                name: 'Fig Treats',
                category: 'fig',
                amount: 200,
            });
            expense.save((err, expense) => {
                chai.request(server)
                    .put('/expense/' + expense.id)
                    .send({ name: 'Fig Treats', category: 'fig', amount: 100 })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Expense updated');
                        res.body.expense.should.have.property('amount').eql(100);
                        done();
                    })
            })
        })
    })

    describe('/DELETE/:id expense', () => {
        it('should DELETE an expense given the id', (done) => {
            let expense = new Expense({
                name: 'Beer',
                category: 'Spending money',
                amount: 15
            });

            expense.save((err, expense) => {
                chai.request(server)
                    .delete('/expense/' + expense.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Expense removed');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                        done();
                    })
            })
        })
    })
});