const express = require('express');
const router = express.Router();
const {User,validateUser}= require('../model/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Joi = require('joi');


router.get("/login", (req,res)=>{
    res.render("login");
});

router.get("/signup",(req,res)=>{
    res.render("signup");
});


/* SIGNUP USER. */
router.post('/signup',  async (req, res) =>{
    const validation = validateUser().validate(req.body); //catch the exception
    if (validation.error) 
        return res.status(400).send(validation.error.details[0].message);

    let user = await User.findOne({ email: req.body.email })

    if(user)
        return res.status(400).send('User already registered');
    else
    {
        user = new User(_.pick(req.body, ['firstname', 'lastname', 'birthday','email','password','marital_status']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        // const token = user.generateAuthToken();
        // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstname', 'lastname']));
        res.render('login');
    }
});

/* LOGIN USER. */
router.post('/login', async (req, res)=> {
    const validation = validateCreds().validate(req.body); //catch the exception

    if (validation.error) return res.status(400).send(validation.error.details[0].message);

    let user = await User.findOne({ email: req.body.email })

    if(!user) return res.status(400).send('Invalid Email or Password');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
    return res.status(400).send('Invalid Email or Password');
    }

    else {
            // const token = user.generateAuthToken();
            // res.send(token);
            req.session.user = user;
            res.redirect('/nav');
        }
    }
);

const validateCreds=data=> {
    const schema =Joi.object().keys({
      email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .messages({
        'string.min': "Email must contain at least 5 characters",
        'string.max': "Email is limited to 255 characters",
        'string.required': "Email is required",
        'string.email': "Email format is invalid",
      }),

      password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .messages({
        'string.required': "Password is required",
        'string.min': "Password must contain at least 5 characters",
        'string.max': "Password is limited to 255 characters",
      }),
    })
    return schema;
  };

module.exports = router;

