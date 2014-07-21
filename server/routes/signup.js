/**
 * Created by IronMan on 7/16/14.
 */

var express = require('express');
var router = express.Router();
var validate = require('../utils/validator');
var user = require('../models/user');
var logger = require('log4js').getLogger();
var crypt = require('../utils/crypt');
var session = require('./session');
var sessionCtrl = require('../controllers/sessionCtrl');
var redirectCtrl = require('../controllers/redirectCtrl');

router.route('/')
    .post(function (req, res, next) {
        var body = req.body;
        /** @namespace body.confirmPassword */
        if(!body.emailId || !body.password || !body.confirmPassword || !body.firstName || !body.lastName || !body.country){
            res.send(400, {reason: 'Missing fields'});
            return;
        }

        if(!validate.name(body.firstName) || !validate.name(body.lastName)){
            res.json(400, {reason: 'Please enter correct name.'});
            return;
        }

        if(!validate.country(body.country)){
            res.json(400, {reason: 'Please enter correct country.'});
            return;
        }

        if(body.confirmPassword !== body.password){
            res.json(400, {reason: 'Passwords do not match'});
            return;
        }

        var currentDate = new Date();

        var properties = {
            firstName: body.firstName.trim().toLowerCase(),
            lastName: body.lastName.trim().toLowerCase(),
            country: body.country.trim().toLowerCase(),
            emailId: body.emailId.trim().toLowerCase(),
            password: crypt.password.hash(body.password),
            devices: [],
            media: [],
            pairCodes: [],
            nextPairCode: null,
            createdAt: currentDate,
            updatedAt: currentDate,
            isActive: true
        };
        //create the user,
        user.create(properties)
            .then(function(instance){
                logger.info(instance.toString());
                req.tv.user = instance;
                next();
            })
            .catch(function(error){
                logger.error(error);
                if(error.reason && error.reason.code === 11000){
                    res.json(400, {reason: 'User already exists'});
                }
                else{
                    res.json(500, {reason: 'Internal Server Error'});
                }
            })
            .done();
    })
    .post(sessionCtrl.findOrCreateSession)
    .post(redirectCtrl.to.dashboard);

module.exports = router;
