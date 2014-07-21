/**
 * Created by IronMan on 7/19/14.
 */

var express = require('express');
var router = express.Router();
var paircode = require('../models/paircode');
var device = require('../models/device');
var user = require('../models/user');
var logger = require('log4js').getLogger();
var sanitize = require('../utils/sanitize');
var responseError = require('../utils/response-error');
var pairingService = require('../services/pairingService');
var crypt = require('../utils/crypt');
router.route('/generate')
    .get(function (req, res, next) {
        var userIns = req.tv.user;
        if (userIns.nextPairCode) {
            user.populate(userIns, ['nextPairCode'])
                .then(function (populated) {
                    res.json(200, sanitize.pairCode(populated.nextPairCode));
                })
                .catch(function (error) {
                    logger.error(error);
                    next(responseError.INTERNAL_SERVER_ERROR);
                });
            return;
        }

        pairingService.createNewPairCode(userIns)
            .then(function (result) {
                res.json(200, sanitize.pairCode(result.pairCode));
            })
            .catch(function (error) {
                next(error);
            });
    });


router.route('/add')
    .post(function (req, res, next) {
        var data = req.body;
        if (!data || !data.key || !data.passcode) {
            next(responseError.MISSING_FIELDS);
            return;
        }

        pairingService.verifyNewPairRequest({key: data.key, passcode: data.passcode, isUsed: false})
            .then(function (result) {
                var date = new Date();
                result.device = {
                    name: data.name ? data.name.toLowerCase() : '',
                    type: data.type ? data.type.toLowerCase() : '',
                    os: data.os ? data.os.toLowerCase() : '',
                    model: data.model ? data.model.toLowerCase() : '',
                    pairCodeId: result.pairCode._id,
                    userId: result.user._id,
                    authToken: crypt.pair.connectToken(data.key),
                    createdAt: date,
                    updatedAt: date
                };

                pairingService.pairNewDevice(result)
                    .then(function (result) {
                        logger.debug(result);
                        res.json(200, sanitize.device(result.device));
                    })
                    .catch(function (error) {
                        next(error);
                    });
            })
            .catch(function (error) {
                next(error);
            });
    });
module.exports = router;