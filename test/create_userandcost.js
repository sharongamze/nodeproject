const User = require('../model/users').User;
const assert = require('assert');
const Cost = require('../model/cost');
const mongoose = require("mongoose");


describe('Creating documents', () => {
    it('creates a user', (done) => {
        let date = new Date(1998, 5, 10);
        const newUser = new User({
            firstname: 'Sharon',
            lastname: 'Cohen',
            birthday: date,
            email: 'shar123@gmail.com',
            password: '123456',
            marital_status: 'Single'
        });
        newUser.save()
            .then(() => {
                assert(!newUser.isNew);
                done();
            });
    });
    it ('creates a cost', (done) => {
        let date_new = new Date(2021, 5, 10);
        var newId = new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca');
        const cost = new Cost({
            sum: 20,
            category: 'Home',
            description: 'Tv',
            User: newId,
            date : date_new
        });

       cost.save()
            .then(() => {
                assert(!cost.isNew);
                done();
            });

    });
});


