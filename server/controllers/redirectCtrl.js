/**
 * Created by IronMan on 7/18/14.
 */

var logger = require("winston");

var redirect = module.exports;

redirect.to = {};

redirect.to.login = function (req, res, next) {
    res.redirect('/');
};

redirect.to.dashboard = function(req, res, next){
    res.redirect('/dashboard');
};