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
            logger.info(error);
            deferred.reject({reason: error});
        })
        .done();
    return deferred.promise;
};


session.sanitizeQuery = function (query) {
    if (!query) return query;

    if (query._id && typeof query._id === 'string')
        query._id = mongoose.Types.ObjectId(query._id);

    if (query.userId && typeof query.userId === 'string')
        query.userId = mongoose.Types.ObjectId(query.userId);

    return query;
};

