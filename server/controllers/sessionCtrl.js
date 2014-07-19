/**
 * Created by IronMan on 7/17/14.
 */

var sessionCtrl = module.exports;
var session = require('../models/session');
var logger = require('winston');
var cookie = require('../utils/cookie');
/**
 * Finds or creates a new session if an existing session is not found
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
sessionCtrl.findOrCreateSession = function (req, res, next) {
    var user = req.tv.user;
    var promise = session.findOrCreate({userId: user._id});
    promise
        .then(function (instance) {
            req.tv.session = instance;
            cookie.create.session(res, user._id, instance.token);
            next();
        })
        .catch(function (error) {
            logger.error(error);
            res.json(500, {reason: 'Internal Server Error'});
        })
        .done();
};

/**
 * Verifies a user session
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
sessionCtrl.verifySession = function (req, res, next) {
    var userId = req.signedCookies.user_id;
    var token = req.signedCookies.token;
    if(!userId || !token){
        cookie.clear.session(res);
        res.redirect('/');
        return;
    }

    var query = {
        userId: userId,
        token: token
    };
    session.findOne(query)
        .then(function (instance) {
            if(instance){
                session.populate(instance, ['userId'])
                    .then(function (populated) {
                        req.tv.session = populated;
                        req.tv.user = populated.userId;
                        next();
                    })
                    .catch(function (error) {
                        logger.error(error);
                        res.json(500, {reason: 'Internal Server Error'});
                    })
                    .done();
            } else{
                cookie.clear.session(res);
                res.redirect('/');
            }
        })
        .catch(function (error) {
            logger.error(error);
            res.json(500, {reason: 'Internal Server Error'});
        })
        .done()
};