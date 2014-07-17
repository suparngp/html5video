/**
 * Created by IronMan on 7/16/14.
 */

var express = require('express');
var router = express.Router();
var validate = require('../utils/validator');
var user = require('../db/models/user');
var logger = require('winston');
var crypt = require('../utils/crypt');
var session = require('../db/models/session');
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

        function createSession(user){
            var date = new Date();
            var properties = {
                token: crypt.session.token(),
                userId: user._id,
                createdAt: date,
                updatedAt: date
            };
            session.create(properties)
                .then(function(instance){
                    console.log(instance);
                    res.cookie('user_id', user._id, {signed: true, maxAge: 90000});
                    res.cookie('auth_token', instance.token, {signed: true, maxAge: 90000});
                    res.json(200, user);
                }, function(error){
                    logger.error(error);
                    res.json(500, {reason: 'Internal Server Error'});
                })
                .catch(function(error){
                    logger.error(error);
                    res.json(500, {reason: 'Internal Server Error'});
                });
        }

        //create the user,
        user.create(properties)
            .then(function(instance){
                logger.info(instance.toString());
                createSession(instance);
                console.log('Here');
            }, function(error){
                logger.error(error);
                if(error.reason && error.reason.code === 11000){
                    res.json(400, {reason: 'User already exists'});
                }
                else{
                    res.json(500, {reason: 'Internal Server Error'});
                }
            })
            .catch(function(error){
                logger.error(error);
                res.json(500, {reason: 'Internal Server Error'});
            });
    });

module.exports = router;
