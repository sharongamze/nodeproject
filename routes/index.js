const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cost = require('../model/cost');
const Changes= require('../model/userchanges')
const response = require('./response.js');
const _ = require('lodash');

const app = express();
const exphbs = require("express-handlebars");
const Joi = require('joi');

router.get('/', (req, res) =>{
  if(req.session.user){
    res.render('nav');
  }
  else {
    res.render('login');
  }
});

router.get('/logout', (req, res)=> {
    req.session.destroy(function(err){
    if(err){
      console.log(err);
      response.errorResponse(err.message,res);
    }
    else
    {
      res.render('login');
    }
  });
});


router.get('/add_expense', (req, res)=> {
  console.log(req.session.user._id)
  if(!req.session.user){
    res.render('nav');
  }else{
    res.render('expense');
  }
});

router.get('/nav', (req, res) =>{
    if (req.session.user) {
        res.render('nav');
    }
});

router.post('/insert', async (req, res)=> {
  const validation = validateCost().validate(req.body); 
  if (validation.error) 
      return res.status(400).send(validation.error.details[0].message);

  let cost = {
    sum: req.body.sum,
    category: req.body.category,
    description: req.body.description,
    User: req.session.user,
    date : req.body.date,
  };

  let user = req.session.user;
  let data_cost = new Cost(cost);
  await data_cost.save();
  await Cost.find({User:user}) 
        .then(async function (doc) {
          const id=[];
            doc.forEach(element => id.push(element._id))
            id.forEach(element => {if(element.equals(data_cost._id)){let index = id.indexOf(element);id.splice(index,1)}});
            if (id.length > 0) {
                let userchange = {
                    User: user,
                    revision: id.length
                };
                let new_user_change = new Changes(userchange);
                await new_user_change.save();
                await Changes.findByIdAndUpdate(new_user_change, {$push: {Cost: id}})
            }

        });

  res.render('expense');
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

router.get('/get_report',(req, res) =>{
    res.render('report.hbs');
});

router.post('/test/submit',async (req, res) =>{
  var date= new Date(req.body.month);
  const month = date.getMonth();
  const year = date.getFullYear();
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
  const condition = { date:  { "$gte": fromDate.toString(), "$lte" : toDate.toString() } , User: req.session.user};
  console.log(fromDate.toString());
  console.log(toDate.toString());
  await Cost.find(condition)
      .then(function(doc) {
        var category= [];
        var sum=[];
        var total=0;
        doc.forEach(element => category.push(element.category));
        doc.forEach((element => (sum.push(element.sum), total += parseFloat(element.sum))));
        res.render('report.hbs', {items: doc, category:category, sum:sum, total: total});
      });
});

router.post('/test/all',async (req, res) =>{
  await Cost.find({User: req.session.user})
        .then(function(doc) {
            var category= [];
            var sum=[];
            var total=0;
            doc.forEach(element => category.push(element.category));
            doc.forEach((element => (sum.push(element.sum), total += parseFloat(element.sum))));
            res.render('report.hbs', {items: doc, category:category, sum:sum, total: total});
        });
});


const validateCost=data=> {
  const schema =Joi.object().keys({
    sum: Joi.number()
    .min(0)
    .max(999999)
    .required()
    .messages({
      'number.required': "Sum is required",
      'number.min': "Sum value must be positive'",
      'number.max': "Max sum value is 999999",
    }),
    date: Joi.date()
    .required()
    .messages({
      'date.required': "Expense date is required",
    }),
  category: Joi.required(),
  description: Joi.optional(),
  })

  return schema;
};
module.exports = router;
