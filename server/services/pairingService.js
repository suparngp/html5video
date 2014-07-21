/**
 * Created by IronMan on 7/19/14.
 */


'use strict';

/**
 * Service to pair device, generate pair codes and more
 * @class pairingService
 * @static
 */
var paircode = require('../models/paircode');
var user = require('../models/user');
var device = require('../models/device');
var Q = require('q');
var logger = require('log4js').getLogger();
var responseError = require('../utils/response-error');

var service = module.exports;


/**
 * Finds the pair code and the user associated with the key and passcode. If no such combination is found,
 * this method rejects the promise.
 * @param properties the properties to match.
 * @return {Q.Promise<T>} promise which gets resolved into an object
 *
 *     {
 *         user: {},
 *         pairCode: {}
 *     }
 *
 * @method verifyNewPairRequest
 */

service.verifyNewPairRequest = function (properties) {
    var deferred = Q.defer();
    paircode.findOne(properties)
        .then(function (pairCodeInstance) {
            if (!pairCodeInstance) {
                deferred.reject(responseError.INVALID_PAIRCODE);
                return;
            }
            user.findOne({nextPairCode: pairCodeInstance._id})
                .then(function (userInstance) {
                    if (!userInstance) {
                        deferred.reject(responseError.INVALID_PAIRCODE);
                        return;
                    }
                    deferred.resolve({user: userInstance, pairCode: pairCodeInstance});

                })
                .catch(function (error) {
                    logger.error(error);
                    deferred.reject(responseError.INTERNAL_SERVER_ERROR);
                })
                .done();
        })
        .catch(function (error) {
            logger.error(error);
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        })
        .done();

    return deferred.promise;
};

/***
 * Adds a new device in the database. It first creates a device.
 * Then the new device is added to the user's devices list
 * @method addNewDevice
 * @param  properties {Object} the properties of type {user: {}, device: {}}
 * @return {Q.Promise<T>} a promise which gets resolved into an object of type
 *
 *     {
 *         user: {},
 *         device: {}
 *     }
 */

service.addNewDevice = function (properties) {
    var deferred = Q.defer();
    var userInstance = properties.user;
    var deviceProps = properties.device;

    device.create(deviceProps)
        .then(function (deviceInstance) {

            var update = {
                updatedAt: deviceProps.createdAt,
                devices: userInstance.devices.concat([deviceInstance._id])
            };

            user.updateOne({_id: userInstance._id}, update, {'new': true})
                .then(function (updatedUserInstance) {
                    properties.device = deviceInstance;
                    properties.user = updatedUserInstance;
                    deferred.resolve(properties);
                })
                .catch(function (error) {
                    var x = JSON.stringify(error);
                    logger.error(x);
                    deferred.reject(responseError.INTERNAL_SERVER_ERROR);
                })
                .done();
        })
        .catch(function (error) {
            logger.error(JSON.stringify(error));
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        })
        .done();
    return deferred.promise;
};

/***
 * Creates a new pair code.
 * It first sets the existing code for the user as used.
 * Then a new code is generated. The new code is added to the user's pairCodes list.
 * @method createNewPairCode
 * @param userInstance
 * @return {Q.Promise<T>} a promise which gets resolved into an object of type
 *
 *      {
 *          user: {},
 *          pairCode: {}
 *      }
 */
service.createNewPairCode = function (userInstance) {
    var deferred = Q.defer();

    //promise 1 to update existing pair code
    var p1 = null;
    if (userInstance.nextPairCode) {
        p1 = paircode.updateOne({_id: userInstance.nextPairCode}, {isUsed: true});
    }

    //promise p2 to create a new pair code
    var p2 = paircode.createUntilUnique({userId: userInstance._id});
    var promises = [];

    if (p1) promises.push(p1);
    promises.push(p2);

    Q.all(promises)
        .then(function (result) {
            var pairCodeInstance = result[promises.length - 1];
            logger.info('Generated new Pair code', pairCodeInstance.toObject());
            var update = {
                nextPairCode: pairCodeInstance._id,
                pairCodes: userInstance.pairCodes.concat([pairCodeInstance._id]),
                updatedAt: pairCodeInstance.createdAt
            };
            user.updateOne({_id: userInstance._id}, update)
                .then(function (updatedUser) {
                    logger.info('User Updated', updatedUser.toObject());
                    deferred.resolve({user: updatedUser, pairCode: pairCodeInstance});
                })
                .catch(function (error) {
                    logger.error(error);
                    deferred.reject(responseError.INTERNAL_SERVER_ERROR);
                })
                .done();
        })
        .catch(function (error) {
            logger.error(error);
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        })
        .done();

    return deferred.promise;
};

/**
 * Pairs a new device. It first adds the device using [addNewDevice](#).
 * Next it creates a new pair code using [createNewPairCode](#).
 * @method pairNewDevice
 *
 * @param properties the properties of the new device and user
 * @return {Q.Promise<T>} a promise which gets resolved in
 *      {
 *          user: {},
 *          device: {},
 *          pairCode: {}
 *      }
 */
service.pairNewDevice = function (properties) {
    var deferred = Q.defer();
    service.addNewDevice(properties)
        .then(function (result1) {
            service.createNewPairCode(result1.user)
                .then(function (result2) {
                    result2.device = result1.device;
                    deferred.resolve(result2);
                })
                .catch(function (error) {
                    logger.error(error);
                    deferred.reject(responseError.INTERNAL_SERVER_ERROR);
                })
                .done();
        })
        .catch(function (error) {
            logger.error(error);
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        })
        .done();

    return deferred.promise;
};