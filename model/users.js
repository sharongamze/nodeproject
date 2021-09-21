const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const UserSchema=new mongoose.Schema({
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
    unique:true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  birthday:{
   type:Date,
   required: true
  },
  marital_status:{
    type:String,
    enum: ['Single', 'Married', 'Widowed', 'Separated',"Divorced"]
  },
  createdAt: {type: Date, default: Date.now}
}, {collection: 'UserData'});

UserSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id}, config.get('appPrivateKey'));
  return token;
}

function validateUser(user) {
  const schema = {
    firstname: Joi.string().min(2).max(24).required(),
    lastname: Joi.string().min(2).max(24).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

module.exports = mongoose.model("UserData",UserSchema);

// exports.User = User; 
exports.validate = validateUser;


