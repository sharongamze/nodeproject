var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sharongamze:sharongamze@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority');
const Cost = require('../model/cost'); // cost model
var Response = require('./respons.js');
var app = express();


router.get('/', function(req, res) {
  if(req.session.user){
    res.render('nav')
  }
  else {
    res.render('login')
  }
});


router.get('/logout', function(req, res) {
    req.session.destroy(function(err){
    if(err){
      console.log(err);
      Response.errorResponse(err.message,res);
    }
    else
    {
      res.render('login');
    }
  });
});


router.get('/add_expense', function(req, res) {
  console.log(req.session.user._id)
  if(!req.session.user){
    console.log(req.session.user.username)
    res.render('nav')
  }else{
    res.render('index')
  }
});

router.get('/nav', function(req, res, next) {
    if (req.session.user) {
        res.render('nav');
    }
});


router.post('/insert', function(req, res, next) {
  var cost = {
    sum: req.body.sum,
    category: req.body.category,
    description: req.body.description,
    User: req.session.user,
    date : req.body.date,
  };

  var data_cost = new Cost(cost);
  data_cost.save();

  res.render('index');
});

const exphbs = require("express-handlebars");

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


router.get('/get_report',function(req, res, next) {
    // const month = 1;
    // const year = 1990;
    // const fromDate = new Date(year, month-1, 1);
    // const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    // const condition = { date:  { "$gte": fromDate.toString(), "$lte" : toDate.toString() } , User: req.session.user};
    // console.log(fromDate.toString())
    // console.log(toDate.toString())
    // Cost.find(condition)
    //     .then(function(doc) {
    //         var category= [];
    //         doc.forEach(element => category.push(element.category));
    //         console.log(category);
    //         res.render('report.hbs', {items: doc, category:category});
    //     });
    res.render('report.hbs')

});

router.post('/test/submit',function(req, res, next) {
  var date= new Date(req.body.month)
  var month_input = date.getMonth()
  const month = month_input;
  const year = date.getFullYear();
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
  const condition = { date:  { "$gte": fromDate.toString(), "$lte" : toDate.toString() } , User: req.session.user};
  console.log(fromDate.toString());
  console.log(toDate.toString());
  Cost.find(condition)
      .then(function(doc) {
        var category= [];
        var sum=[];
        doc.forEach(element => category.push(element.category))
        doc.forEach(element => sum.push(element.sum))
        console.log(category);
        console.log(sum);
        res.render('report.hbs', {items: doc, category:category, sum:sum});
      });
});

router.post('/test/all',function(req, res, next) {
    Cost.find({User: req.session.user})
        .then(function(doc) {
            var category= [];
            var sum=[];
            doc.forEach(element => category.push(element.category));
            doc.forEach(element => sum.push(element.sum));
            res.render('report.hbs', {items: doc, category:category, sum:sum});
        });
});

module.exports = router;