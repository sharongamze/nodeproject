const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const costCollection= new Schema({
    sum: {
    type: Number,
        min:0,
        required: true
    },
    category:  String,
    description: String,
    User: {
        type: Schema.Types.ObjectId,
         ref: 'UserData'
        },
    date:{ 
        type:Date,
        required:true
    },
}, {collection: 'cost-collection'});



module.exports = mongoose.model('cost-collection', costCollection);