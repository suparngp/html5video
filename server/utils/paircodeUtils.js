/**
 * Created by IronMan on 7/17/14.
 */

var paircodeUtils = module.exports;
var paircode = require('../db/models/paircode');
var Q = require('q');

paircodeUtils.generateRandomPairKey= function(){
    return (Math.floor(Math.random() * 900000) + 100000).toString();
};

paircodeUtils.generateRandomPassword = function(){
    return (Math.floor(Math.random() * 9000) + 1000).toString();
};
