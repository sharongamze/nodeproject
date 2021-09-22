
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const app = express();
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/auth');
const signupRouter = require('./routes/signup');
const config = require('config');
const cons = require('consolidate');

const appkey=config.get('appPrivateKey'); 

app.use(session({
  secret: appkey,
  resave: false,
  saveUninitialized: true
}));

require('./startup/config')();
require('./startup/db')();
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', loginRouter,signupRouter);
app.use('/', indexRouter);


/*Middleware functions  */

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;