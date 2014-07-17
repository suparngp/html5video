/**
 * Created by IronMan on 7/16/14.
 */

'use strict';
var paircode = {};
var mongoose = require('mongoose');
var Q = require('q');
var paircodeUtils = require('../../utils/paircodeUtils');

/**
 * New PairCode schema
 */
paircode.paircodeSchema = mongoose.Schema({
    key: String,
    passcode: String,
    createdAt: Date,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

paircode.PairCode = mongoose.model('PairCode', paircode.paircodeSchema);


/**
 * Creates a new pair code
 * @param properties the properties for the new instance
 */
paircode.create = function (properties) {
    var defer = Q.defer();
    var instance = new paircode.PairCode(properties);
    instance.save(function (err, pairCode) {
        if (err) {
            defer.reject({reason: err});
        }
        else {
            instance = pairCode;
            defer.resolve(pairCode);
        }
    });
    return defer.promise;
};

/**
 * Create a passcode with a unique key, keeps looping until such instance is created.
 * @param userId the user's id
 * @return {Q.Promise<T>} promise which gets resolved in the new instance
 */
paircode.createUntilUnique = function (userId) {
    var deferred = Q.defer();
    function recursiveCreate() {
        var properties = {
            key: paircodeUtils.generateRandomPairKey(),
            passcode: paircodeUtils.generateRandomPassword(),
            createdAt: new Date(),
            userId: userId
        };
        paircode.create(properties)
            .then(function (paircodeInstance) {

                deferred.resolve(paircodeInstance);

            }, function (error) {
                if (error.reason.code === 11000) {
                    recursiveCreate();
                }
                else {
                    deferred.reject({reason: error.reason || error});
                }
            })
            .catch(function (error) {
                deferred.reject({reason: error.reason || error});
            });
    }
    recursiveCreate();
    return deferred.promise;
};


module.exports = paircode;