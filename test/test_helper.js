//inside tests/test_helper.js
const mongoose = require('mongoose');
const config = require('config');
const Cost= require('../model/cost');
//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;


/// new Data Base For testing
//to run tests- npm run test

mongoose.connect(`mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@cluster0.6p3gd.mongodb.net/Test?retryWrites=true&w=majority`).then(() => console.log('Connected to MongoDB Successfully'))
mongoose.connection
    .on('error', (error) => {
        console.warn('Error : ',error);
    });
//Called hooks which runs before something.

after((done) => {
    mongoose.connection.collections.UserData.drop(() => {
        done();
    });

});


after((done) => {
    mongoose.connection.collections["cost-collection"].drop(()=> {

        done();
    });

});


