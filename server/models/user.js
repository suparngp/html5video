/**
 * Schema for user
 * Created by IronMan on 7/16/14.
 */

'use strict';

var user = module.exports;
var mongoose = require('mongoose');
var Q = require('q');
var base = require('./base');

user.Schema = mongoose.Schema({
    firstName: String,
    lastName: String,
    country: String,
    emailId: String,
    password: String,
    devices: [],
    media: [],
    pairCodes: [],
    nextPairCode: {type: mongoose.Schema.Types.ObjectId, ref: 'PairCode'},
    createdAt: Date,
    updatedAt: Date,
    isActive: Boolean
});

user.Model = mongoose.model('User', user.Schema);
base.extend(user);

///**
// * creates an instance of user with the given properties.
// * @param properties the properties of the user
// */
//user.create = function (properties) {
//    var defer = Q.defer();
//    var instance = new this.Model(properties);
//    Q.nfcall(instance.save.bind(instance))
//        .then(function (instance) {
//            defer.resolve(instance[0]);
//        })
//        .catch(function (error) {
//            defer.reject({reason: error});
//        })
//        .done();
//    return defer.promise;
//};

/**
 * Finds a user instance by email id
 * @param emailId the email id
 * @return {Q.Promise<T>} a promise which gets resolved into user instance or undefined
 */
user.findByEmail = function (emailId) {
    var query = {
        emailId: emailId
    };
    return this.findOne(query);
};

user.sanitizeQuery = function (query) {
    if(!query)
    return query;

    if(query._id && typeof query._id === 'string'){
        query._id = mongoose.Types.ObjectId(query._id.trim());
    }

    return query;
};