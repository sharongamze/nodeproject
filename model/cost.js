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

module.exports = mongoose.model('cost-collection', costSchema);
