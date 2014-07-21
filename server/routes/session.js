/**
 * Created by IronMan on 7/18/14.
 */

var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

var sessionCtrl = require('../controllers/sessionCtrl');
var redirectCtrl = require('../controllers/redirectCtrl');
var user = require('../models/user');
var validate = require('../utils/validator');
var crypt = require('../utils/crypt');
var session = require('../models/session');
var cookie = require('../utils/cookie');

router.route('/login')
    .post(function (req, res, next) {
        var emailId = req.body.emailId;
        var password = req.body.password;
        if (!validate.email(emailId) || !validate.password(password)) {
            res.json(401, {reason: 'Invalid credentials'});
            return;
        }

        emailId = emailId.toString().trim();
        user.findByEmail(emailId)
            .then(function (instance) {
                if (!instance) {
                    res.json(401, {reason: 'Invalid credentials'});
                    return;
                }
                if (crypt.password.validate(password, instance.password)) {
                    req.tv.user = instance;
                    next();
                }
                else {
                    res.json(401, {reason: 'Invalid credentials'});
                }
            })
            .catch(function (error) {
                logger.error(error);
                res.json(500, {reason: 'Internal Server Error'});
            })
            .done();
    })
    .post(sessionCtrl.findOrCreateSession)
    .post(redirectCtrl.to.dashboard);

router.route('/*')
    .all(sessionCtrl.verifySession);

router.route('/logout')
    .post(function (req, res, next) {
        var currentSession = req.tv.session;
        var query = {
            userId: currentSession.userId,
            token: currentSession.token
        };

        session.removeOne(query)
            .then(function () {
                cookie.clear.session(res);
                next()
            })
            .catch(function (error) {
                logger.error(error);
                res.json(500, 'Internal Server Error');
            })
    })
    .post(redirectCtrl.to.login);

module.exports = router;