/**
 * Created by IronMan on 7/16/14.
 */

'use strict';
var paircode = module.exports;
var base = require('./base');
var mongoose = require('mongoose');
var Q = require('q');
var paircodeUtils = require('../utils/paircodeUtils');
var logger = require("winston");


/**
 * New PairCode schema
 */
paircode.Schema = mongoose.Schema({
    key: String,
    passcode: String,
    createdAt: Date,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isUsed: Boolean
});

paircode.Model = mongoose.model('PairCode', paircode.Schema);

base.extend(paircode);

/**
 * Create a passcode with a unique key, keeps looping until such instance is created.
 * @param properties properties containing the user's id
 * @return {Q.Promise<T>} promise which gets resolved in the new instance
 */
paircode.createUntilUnique = function (properties) {
    properties = this.sanitizeQuery(properties);
    var deferred = Q.defer();
    var userId = properties.userId;

    function recursiveCreate() {
        var properties = {
            key: paircodeUtils.generateRandomPairKey(),
            passcode: paircodeUtils.generateRandomPassword(),
            createdAt: new Date(),
            userId: userId,
            isUsed: false
        };
        paircode.create(properties)
            .then(function (instance) {
                deferred.resolve(instance);
            })
            .catch(function (error) {
                logger.error(error);
                if (error.reason.code === 11000) {
                    recursiveCreate();
                }
                else {
                    deferred.reject({reason: error.reason || error});
                }
            });
    }

    recursiveCreate();
    return deferred.promise;
};

paircode.sanitizeQuery = function (query) {
    if (!query) return query;

    if (query._id && typeof query._id === 'string')
        query._id = mongoose.Types.ObjectId(query._id);

    if (query.userId && typeof query.userId === 'string')
        query.userId = mongoose.Types.ObjectId(query.userId);
    return query;
};