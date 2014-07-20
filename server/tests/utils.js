/**
 * Created by IronMan on 7/17/14.
 */


var utils = module.exports;
var Faker = require('faker');
var mongoose = require('mongoose');
var crypt = require('../utils/crypt');
var paircodeUtils = require('../utils/paircodeUtils');

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

utils.createPairCode = function () {
    return{
        key: paircodeUtils.generateRandomPairKey(),
        passcode: paircodeUtils.generateRandomPassword(),
        userId: mongoose.Types.ObjectId(),
        createdAt: new Date(),
        isUsed: false
    };
};

utils.createDevice = function () {
    return {
        name: 'LGE',
        type: 'Smart TV',
        model: '60LB7000',
        os: 'webos',
        pairCode: mongoose.Types.ObjectId(),
        userId: mongoose.Types.ObjectId(),
        authToken: crypt.pair.connectToken(123456),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    };
};