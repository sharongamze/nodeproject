var express = require('express');
var router = express.Router();
const hbs = require('hbs')
const path = require('path')
const session = require("express-session");
const User= require('../model/users');
const app = express();
const alert = require('alert');


router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/signup",(req,res)=>{
    res.render("signup");
});

router.post('/signup', function(req, res) {
    var item = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        email: req.body.email,
        password: req.body.password,
        marital_status: req.body.marital_status,
    };
    var data = new User(item);
    data.save(function(err){
        if(err){
            console.log(err);
            // Response.errorResponse(err.message,res);
        }else{
            res.render('login');
        }
    })
});


/* LOGIN USER. */
router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email, password: password}, function(err, user){
        if(err){
            console.log(err);
            Response.errorResponse(err.message,res);
        }
        if(!user){
            alert("Wrong Credentials")
        }else{
            req.session.user = user;
            res.redirect('/nav');
        }

    })
});

module.exports = router;

