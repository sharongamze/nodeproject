var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
relationship = require("mongoose-relationship");
var User= require('./users');
var Cost= require('./cost');
mongoose.connect('mongodb+srv://sharongamze:sharongamze@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var UserChangesSchema = new Schema({
   revision: {type: Number},
   User:
    {type: Schema.Types.ObjectId, ref: 'UserData'},
    Cost: [{type: Schema.Types.ObjectId, ref: 'cost-collection'}]
}, {collection: 'UserChangesData'});

module.exports = mongoose.model("UserChangerData",UserChangesSchema);




