/**
 * Created by IronMan on 7/17/14.
 */


var session = module.exports;

var mongoose = require('mongoose');
var crypt = require('../utils/crypt');
var Q = require('q');
var logger = require('winston');
var base = require('./base');

session.Schema = mongoose.Schema({
    token: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
    updatedAt: Date
});

session.Model = mongoose.model('Session', session.Schema);

base.extend(session);

///**
// * Creates a session instance
// * @param properties the properties of the session
// * @return {Q.Promise<T>} the promise which gets resolved into session instance
// */
//session.create = function (properties) {
//    var defer = Q.defer();
//    var instance = new session.Session(properties);
//    Q.nfcall(instance.save.bind(instance))
//        .then(function (instance) {
//            defer.resolve(instance[0]);
//        })
//        .catch(function (error) {
//            defer.reject({reason: error[0]});
//        })
//        .done();
//    return defer.promise;
//};

/**
 * Finds an existing session or creates a new session for the user
 * @param {Object} query the search query
 * @return {Q.Promise<T>} a promise which gets resolved in the session instance
 */
session.findOrCreate = function (query) {
    this.sanitizeQuery(query);
    var deferred = Q.defer();

    var promise = Q.nfcall(this.Model.findOneAndUpdate.bind(this.Model), query, {updatedAt: new Date()});
    promise
        .then(function (instance) {
            if (instance) {
                deferred.resolve(instance);
            }
            else {
                var date = new Date();
                var properties = {
                    token: crypt.session.token(),
                    createdAt: date,
                    updatedAt: date,
                    userId: query.userId
                };

                var newSession = new session.Model(properties);

                Q.nfcall(newSession.save.bind(newSession))
                    .then(function (instance) {
                        deferred.resolve(instance[0]);
                    })
                    .catch(function (error) {
                        deferred.reject({reason: error[0]});
                    })
                    .done();
            }
        })
        .catch(function (error) {
            console.log(error);
            deferred.reject({reason: error});
        })
        .done();
    return deferred.promise;
};

//
///**
// * Finds a session for the user
// * @param {String}userId the user Id
// * @param {String} token the token
// * @return {Q.Promise<T>} a promise which gets resolved in the session if found or into undefined.
// */
//session.find = function (userId, token) {
//    if (typeof userId === 'string')
//        userId = mongoose.Types.ObjectId(userId);
//
//    return Q.nfcall(session.Session.findOne.bind(session.Session), {userId: userId, token: token});
//};

///**
// * Removes a session from the data base
// * @param userId the user id
// * @param token the token
// * @return {Q.Promise<T>} a promise which gets resolved into the deleted instance
// */
//session.remove = function (userId, token) {
//    if (typeof userId === 'string')
//        userId = mongoose.Types.ObjectId(userId);
//    var query = {
//        userId: userId,
//        token: token
//    };
//    return Q.nfcall(session.Session.findOneAndRemove.bind(session.Session), query);
//};

session.sanitizeQuery = function (query) {
    if (!query) return query;

    if (query._id && typeof query._id === 'string')
        query._id = mongoose.Types.ObjectId(query._id);

    if (query.userId && typeof query.userId === 'string')
        query.userId = mongoose.Types.ObjectId(query.userId);

    return query;
};

