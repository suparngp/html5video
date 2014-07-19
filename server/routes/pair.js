/**
 * Created by IronMan on 7/19/14.
 */

var express = require('express');
var router = express.Router();
var paircode = require('../models/paircode');
var user = require('../models/user');
var logger = require("winston");


router.route('/code')
    .get(function (req, res, next) {
        var userIns = req.tv.user;

        if(userIns.nextPairCode){
            user.populate(userIns, ['nextPairCode'])
                .then(function (populated) {
                    req.tv.user = populated;
                    res.json(200, populated.nextPairCode);
                })
                .catch(function (error) {
                    logger.error(error);
                    res.json(500, {reason: 'Internal Server Error'});
                });
            return;
        }

        paircode.createUntilUnique({userId: userIns._id})
            .then(function (instance) {
                logger.info(instance.toString());
                user.updateOne({_id: userIns._id}, {nextPairCode: instance._id}, {'new': true})
                    .then(function (updatedUser) {
                        logger.info(updatedUser.toString());
                        req.tv.user = updatedUser;
                        res.json(200, instance);
                    })
                    .catch(function (error) {
                        logger.error(error);
                        res.json(500, {reason: 'Internal Server Error'});
                    });
            })
            .catch(function (error) {
                logger.error(error);
                res.json(500, {reason: 'Internal Server Error'});
            });
    });

module.exports = router;