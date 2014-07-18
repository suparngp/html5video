/**
 * Created by IronMan on 7/17/14.
 */


var utils = module.exports;
var Faker = require('faker');
var mongoose = require('mongoose');
var crypt = require('../utils/crypt');
utils.createUser = function () {
    var date = new Date();
    return {
        firstName: Faker.Name.firstName(),
        lastName: Faker.Name.lastName(),
        country: Faker.Address.ukCountry(),
        emailId: Faker.Internet.email(),
        password: crypt.password.hash(Faker.Name.findName()),
        devices: [],
        media: [],
        pairCodes: [],
        nextPairCode: null,
        createdAt: date,
        updatedAt: date,
        isActive: true
    };
};

utils.createSession = function () {
    var date = new Date();
    return {
        token: crypt.session.token(),
        userId: mongoose.Types.ObjectId(),
        createdAt: date,
        updatedAt: date
    };
};