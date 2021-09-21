const mongoose = require('mongoose');
const relationship = require("mongoose-relationship");
const User= require('./users');
const Cost= require('./cost');

const Schema = mongoose.Schema;

const userChangesSchema = new Schema({
   revision: {
       type: Number
    },
   User:{
    type: Schema.Types.ObjectId, 
    ref: 'UserData'
},
    Cost: [{type: Schema.Types.ObjectId, 
        ref: 'cost-collection'}]
}, {collection: 'UserChangesData'});



module.exports = mongoose.model("UserChangesData",userChangesSchema);



