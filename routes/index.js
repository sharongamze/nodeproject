var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sharongamze:sharongamze@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority');
const Cost = require('../model/cost'); // cost model
const changes= require('../model/userchanges')
var Response = require('./respons.js');
var app = express();


router.get('/', function(req, res) {
  if(req.session.user){
    res.render('nav');
  }
  else {
    res.render('login');
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
    res.render('nav');
  }else{
    res.render('index');
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
    category: req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1),
    description: req.body.description,
    User: req.session.user,
    date : req.body.date,
  };

  var data_cost = new Cost(cost);
  data_cost.save();
  //add to document versioning?
  Cost.find({User: req.session.user})
        .then(async function (doc) {
            var id=[];
            doc.forEach(element => id.push(element._id))
            if (id.length > 0) {
                var userchange = {
                    User: req.session.user,
                    revision: id.length
                };
                var new_user_change = new changes(userchange);
                await new_user_change.save();
                id.forEach(element => {if(element === data_cost){var index = id.indexOf(element);id.splice(index,1)}});
                await changes.findByIdAndUpdate(new_user_change, {$push: {Cost: id}})
            }

        });


  res.render('index');
});

const exphbs = require("express-handlebars");

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


router.get('/get_report',function(req, res, next) {
    res.render('report.hbs');
});

router.post('/test/submit',function(req, res, next) {
  var date= new Date(req.body.month);
  const month = date.getMonth();
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
        var total=0;
        doc.forEach(element => category.push(element.category));
        doc.forEach((element => (sum.push(element.sum), total += parseFloat(element.sum))));
        res.render('report.hbs', {items: doc, category:category, sum:sum, total: total});
      });
});

router.post('/test/all',function(req, res, next) {
    Cost.find({User: req.session.user})
        .then(function(doc) {
            var category= [];
            var sum=[];
            var total=0;
            doc.forEach(element => category.push(element.category));
            doc.forEach((element => (sum.push(element.sum), total += parseFloat(element.sum))));
            res.render('report.hbs', {items: doc, category:category, sum:sum, total: total});
        });
});

module.exports = router;