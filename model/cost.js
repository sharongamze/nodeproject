const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const costSchema= new Schema({ 
    sum: {
    type: Number,
        min: 0,
        max: 999999,
        required:true,
    },
    category: { 
        type:String,
        enum: ['Food', 'Bills', 'Medical', 'Cosmetics',"Clothes","Mobile","Gadgets", "Entertainment", "Transportation", "Gas","Insurance","Home", "Electricity",
        "Computer and Software","Sport", "Misc"],
    },
    User: {
        type: Schema.Types.ObjectId,
         ref: 'UserData',
        },
    date:{ 
        type:Date,
        required: true,
    },
    description: String,
}, {collection: 'cost-collection'});


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
        'date.required': "Expense date is required",})
    })
    return schema;
  };

//  const Cost= mongoose.model('cost-collection', costSchema);
//  module.exports.Cost=Cost;
module.exports = mongoose.model('cost-collection', costSchema);
// module.exports = {validateCost};