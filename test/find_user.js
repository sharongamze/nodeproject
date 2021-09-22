const assert = require('assert');
const User = require('../model/users').User;
const mongoose = require("mongoose");

before( () => {
    let date = new Date(1997, 7, 10);
    const newUser = new User({
        firstname: 'Hila',
        lastname: 'Levi',
        birthday: date,
        email: 'hila@gmail.com',
        password: 'AAA123456',
        marital_status: 'Single'
    });
    let date_user = new Date(1994, 1, 17);
    const user_two = new User({
        firstname: 'Bar',
        lastname: 'Mor',
        birthday: date_user,
        email: 'barmor@gmail,com',
        password: '112233',
        marital_status: 'Marries'
    });
    newUser.save();
    user_two.save()
        .then(() => done());

});

describe('Reading User details', () => {
    it('find user according to email', (done) => {
        User.findOne({email: 'hila@gmail.com'})
            .then((user) => {
                assert(user);
                done();
            });
    });

});