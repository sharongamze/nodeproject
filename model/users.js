const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const logger = require('morgan');
const _ = require('lodash');

const userSchema=new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 24,
  },
  lastname:  {
    type: String,
    required: true, 
    minlength: 2,
    maxlength: 24,
},
  email: {
    type: String,
    required: true, 
    minlength: 5,
    maxlength: 255,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  birthday:{
   type:Date,
   required: true,
  },
  marital_status:{
    type:String,
    enum: ['Single', 'Married', 'Widowed', 'Separated',"Divorced"]
  },
  createdAt: {type: Date, default: Date.now}
}, {collection: 'UserData'});

const User = mongoose.model('UserData', userSchema);

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id}, config.get('appPrivateKey'));
  return token;
}


const validateUser=data=> {
  const cutoffDate = new Date((Date.now()) - (1000 * 60 * 60 * 24 * 365 * 13));
  const schema =Joi.object().keys({
    firstname: Joi.string()
    .min(2)
    .max(24)
    .required()
    .messages({
      'string.required': "First name is required",
      'string.min': "Name must contain at least 2 characters",
      'string.max': "Name is limited to 24 characters",
    }),
    lastname: Joi.string()
    .min(2)
    .max(24)
    .required()
    .messages({
      'string.required': "Last name is required",
      'string.min': "Name must contain at least 2 characters",
      'string.max': "Name is limited to 24 characters",
    }),
    
    email: Joi.string()
    .email()
    .min(5)
    .max(255)
    .required()
    .messages({
      'string.required': "Email is required",
      'string.email': "Email format is invalid",
      'string.min': "Email must contain at least 5 characters",
      'string.max': "Email is limited to 255 characters",
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
    birthday: Joi.date()
    .max(cutoffDate)
    .required()
    .messages({
      'date.required': "Date of birth is required",
      'date.max': "You must be at least 13 years old",
    }),
    marital_status: Joi.string(),
  })
  return schema;
};


module.exports = {validateUser};
module.exports.User = User;

// module.exports = mongoose.model("UserData",userSchema);



//     email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co.il'] } }).required(),    
