const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const config = require('config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// require('./startup/routes')(app);
// require('./startup/db')();

require('./startup/config')();
require('./startup/db')();


const appkey=config.get('appPrivateKey'); //change location along with the session

app.use(session({
  secret: appkey,
  resave: false,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', loginRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error.hbs');
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;