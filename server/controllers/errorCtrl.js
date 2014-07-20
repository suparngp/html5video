/**
 * Created by IronMan on 7/19/14.
 */

var errorCtrl = module.exports;
var responseError = require('../utils/response-error');
var logger = require("winston");


errorCtrl.handle404 = function (req, res, next) {
    res.json(404, {});
};

errorCtrl.handleErrResponse = function (err, req, res, next) {
    if(err.code && err.status_code && err.message){
        logger.error(err);
        res.json(err.status_code, err);
    }
    else{
        logger.warn('Unknown error', err);
        res.json(500, responseError.INTERNAL_SERVER_ERROR);
    }
};