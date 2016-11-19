let express = require('express');
let app = express();
let path = require('path');
let morgan = require('morgan');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let config = require('config');
let port = 8080;

let expense = require('./routes/expense');

let options = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
};

mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

if (config.util.getEnv('NODE_ENV') !== 'test'){
    app.use(morgan('combined'));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({'type': 'application/json'}));

// app.use(express.static(path.join(__dirname, 'public')));

app.route("/expense")
    .get(expense.getExpenses)
    .post(expense.postExpense);

app.route("/expense/:id")
    .get(expense.getExpense)
    .delete(expense.deleteExpense)
    .put(expense.updateExpense);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);
console.log(`listening on port ${port}`);

module.exports = app;