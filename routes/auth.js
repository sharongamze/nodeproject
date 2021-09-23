const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {User,validateUser}= require('../model/users');
const jwt = require('jsonwebtoken');
const config = require('config');


/* LOGIN USER. */
router.post('/login', async (req, res)=> {
    const validation = validateCreds().validate(req.body); 

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

/* Validate login creds for security reasons => To prevent from malicious user inserting mal scripts   */
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
