var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://sharongamze:sharongamze@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});


var costCollection= new Schema({
    sum : {type: String, required: true},
    category:  String,
    description: String,
    User:[
        {type: Schema.Types.ObjectId, ref: 'UserData'}
    ],
    date: Date,
}, {collection: 'cost-collection'});



module.exports = mongoose.model('cost-collection', costCollection);