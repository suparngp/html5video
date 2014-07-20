/**
 * Created by IronMan on 7/17/14.
 */

'use strict';
var crypt = module.exports;

var crypto = require('crypto');
var snowflake = require('node-snowflake').Snowflake;
var hat = require('hat');

crypt.password = {};

/**
 * Creates a hash of the password
 * @param password the plain text password
 * @return {String} the hashed password
 */
crypt.password.hash = function (password) {
    var shasum = crypto.createHash('sha512');
    shasum.update(password);
    return shasum.digest('hex');
};

/**
 * Validates if the password and its hash are correct
 * @param password the plain text password
 * @param hash the potential hash value
 * @return {boolean} true if the password is valid, else false
 */
crypt.password.validate = function (password, hash) {
    return crypt.password.hash(password) === hash;
};


crypt.session = {};

/**
 * Generates a session token.
 * @return {String} the session token
 */
crypt.session.token = function () {
    var shasum = crypto.createHash('sha256');
    var id = snowflake.nextId();
    shasum.update(id);
    return shasum.digest('hex');
};

crypt.pair = {};

crypt.pair.connectToken = function (pairKey) {
    var shasum = crypto.createHash('sha512');
    var random = hat();
    var timestamp = new Date().getTime();
    shasum.update(pairKey.toString());
    shasum.update(random);
    shasum.update(timestamp.toString());
    return shasum.digest('hex');
};