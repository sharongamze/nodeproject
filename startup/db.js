const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    mongoose.connect(`mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@cluster0.6p3gd.mongodb.net/FinalProject?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch((err) => console.error('Could not connect to MongoDB'));
}