var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
mongoose.connect('mongodb+srv://sharongamze:sharongamze@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var UserSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  birthday: Date,
  marital_status:{
    type:String,
    enum: ['Single', 'Married', 'Widowed', 'Separated',"Divorced"]
  },
  createdAt: {type: Date, default: Date.now}
}, {collection: 'UserData'});


module.exports = mongoose.model("UserData",UserSchema);




