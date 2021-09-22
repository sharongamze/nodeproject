const assert = require('assert');
const Cost = require('../model/cost');
const mongoose = require("mongoose");

let user;
before( () => {
    let date_new = new Date(2021, 8, 10);
    let newId = new mongoose.mongo.ObjectId('613b3ee3d8133b4541546e99');
    const cost = new Cost({
        sum: 400,
        category: 'Electricity',
        description: 'ipad',
        User: newId,
        date: date_new
    });
    user=cost.User;
    cost.save()
        .then(() => done());

});

describe('Reading Cost details', () => {
    it('finds cost with user', (done) => {
        Cost.findOne({ User: user})
            .then((cost) => {
                assert(cost.User.equals(user));
                done();
            });
    })
});


describe('Reading Cost details', () => {
    it('finds cost with date', (done) => {
        let date = new Date(8, 2021);
        const month = date.getMonth();
        const year = date.getFullYear();
        const fromDate = new Date(year, month, 1);
        const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
        const condition = {date: {"$gte": fromDate.toString(), "$lte": toDate.toString()}};
        Cost.find(condition)
            .then((cost) => {
                assert(!cost.date);
                done();
            });
    });

});


