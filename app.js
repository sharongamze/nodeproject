var createError = require('http-errors');
var express = require('express');
const exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

var app = express();


var cons = require('consolidate');
const bodyParser = require("body-parser");


// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'djhxcvxfgshjfgjhgsjhfgakjeauytsdfy', // a secret key you can write your own
  resave: false,
  saveUninitialized: true
}));


app.use('/user', loginRouter);
app.use('/', indexRouter);
// // app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: true }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error.html');
  res.render('error', {
    message: err.message,
    error: err
  });
});

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://sharongamze:sharongamze@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority', {
  useMongoClient: true
})
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));





module.exports = app;
