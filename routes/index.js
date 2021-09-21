const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cost = require('../model/cost');
const Changes= require('../model/userchanges')
const response = require('./response.js');
const _ = require('lodash');
const app = express();
const exphbs = require("express-handlebars");


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


router.post('/insert', async (req, res) =>{
  const cost = {
    sum: req.body.sum,
    category: req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1),
    description: req.body.description,
    User: req.session.user,
    date : req.body.date,
  };

  let data_cost = new Cost(cost);
  await data_cost.save();
  await Cost.find({User: req.session.user})
        .then(async function (doc) {
            let id=[];
            doc.forEach(element => id.push(element._id))
            id.forEach(element => {if(element.equals(data_cost._id)){var index = id.indexOf(element);id.splice(index,1)}});
            if (id.length > 0) {
                let userchange = {
                    User: req.session.user,
                    revision: id.length
                };
                let new_user_change = new Changes(userchange);
                await new_user_change.save();
                await Changes.findByIdAndUpdate(new_user_change, {$push: {Cost: id}})
            }

        });
    console.log("got here");
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

module.exports = router;



//**************************************************************************************************************************** */
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Cost = require('../model/cost');
// const changes= require('../model/userchanges')
// const response = require('./response.js');
// const _ = require('lodash');
// const app = express();

// // require('../startup/db')();

// router.get('/', function(req, res) {
//   if(req.session.user){
//     res.render('nav');
//   }
//   else {
//     res.render('login');
//   }
// });


// router.get('/logout',  (req, res) =>{
//     req.session.destroy(function(err){
//     if(err){
//       console.log(err);
//       response.errorResponse(err.message,res);
//     }
//     else
//     {
//       res.render('login');
//     }
//   });
// });

// router.get('/add_expense', (req, res) =>{
//   console.log(req.session.user._id)
//   if(!req.session.user){
//     res.render('nav');
//   }else{
//     res.render('expense');
//   }
// });

// router.get('/nav', (req, res) =>{
//     if (req.session.user) {
//         res.render('nav');
//     }
// });

// router.post('/insert', function(req, res, next) {
//   var cost = {
//     sum: req.body.sum,
//     category: req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1),
//     description: req.body.description,
//     User: req.session.user,
//     date : req.body.date,
//   };

//   var data_cost = new Cost(cost);
//   data_cost.save();
//   //add to document versioning?
//   Cost.find({User: req.session.user})
//         .then(async function (doc) {
//             var id=[];
//             doc.forEach(element => id.push(element._id))
//             id.forEach(element => {if(element.equals(data_cost._id)){var index = id.indexOf(element);id.splice(index,1)}});
//             if (id.length > 0) {
//                 var userchange = {
//                     User: req.session.user,
//                     revision: id.length
//                 };
//                 var new_user_change = new changes(userchange);
//                 await new_user_change.save();
//                 await changes.findByIdAndUpdate(new_user_change, {$push: {Cost: id}})
//             }

//         });


//   res.render('index');
// });


// // router.post('/insert', async(req, res) =>{
// //   // const cost = {
// //   //   sum: req.body.sum,
// //   //   description: req.body.description,
// //   //   User: req.session.user,
// //   //   date : req.body.date,
// //   // };

// //   let new_cost = new Cost(_.pick(req.body, ['sum', 'description', 'User','date']));
// //   // let data_cost = new Cost(cost);
// //   await new_cost.save();


// //   new_cost.find({User: req.session.user})
// //         .then(async function (doc) {
// //           let id=[];
// //             doc.forEach(element => id.push(element._id))
// //             id.forEach(element => {if(element.equals(data_cost._id)){let index = id.indexOf(element);id.splice(index,1)}});
// //             if (id.length > 0) {
// //               let userchange = {
// //                     User: req.session.user,
// //                     revision: id.length
// //                 };
// //                 let new_user_change = new changes(userchange);
// //                 try{
// //                 await new_user_change.save();
// //                 await changes.findByIdAndUpdate(new_user_change, {$push: {Cost: id}});
// //                 }
// //                 catch(ex){
// //                   for(field in ex.errors)
// //                     console.log(ex.console.error([field].message));
// //                 }
// //             }
// //         });

// //   res.render('expense');
// // });
// const exphbs = require("express-handlebars");
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');


// router.get('/get_report',function(req, res, next) {
//     res.render('report.hbs');
// });

// router.post('/test/submit',function(req, res, next) {
//   let date= new Date(req.body.month);
//   const month = date.getMonth();
//   const year = date.getFullYear();
//   const fromDate = new Date(year, month, 1);
//   const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
//   const condition = { date:  { "$gte": fromDate.toString(), "$lte" : toDate.toString() } , User: req.session.user};
//   console.log(fromDate.toString());
//   console.log(toDate.toString());
//   Cost.find(condition)
//       .then(function(doc) {
//         let category= [];
//         let sum=[];
//         let total=0;
//         doc.forEach(element => category.push(element.category));
//         doc.forEach((element => (sum.push(element.sum), total += parseFloat(element.sum))));
//         res.render('report.hbs', {items: doc, category:category, sum:sum, total: total});
//       });
// });

// router.post('/test/all',function(req, res, next) {
//     Cost.find({User: req.session.user})
//         .then(function(doc) {
//           let category= [];
//           let sum=[];
//           let total=0;
//             doc.forEach(element => category.push(element.category));
//             doc.forEach((element => (sum.push(element.sum), total += parseFloat(element.sum))));
//             res.render('report.hbs', {items: doc, category:category, sum:sum, total: total});
//         });
// });

// module.exports = router;