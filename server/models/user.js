/**
 * Schema for user
 * Created by IronMan on 7/16/14.
 */

'use strict';
/**
 * User model to manage users collection.
 * @class User
 * @static
 * @extends Base
 * */

var user = module.exports;
var mongoose = require('mongoose');
var Q = require('q');
var base = require('./base');
/**
 * @property firstName
 * @type String
 * */

/**
 * @property lastName
 * @type String
 * */

 user.Schema = mongoose.Schema({
    firstName: String,
    lastName: String,
    country: String,
    emailId: String,
    password: String,
    devices: [{type: mongoose.Schema.Types.ObjectId, ref: 'Device'}],
    media: [],
    pairCodes: [{type: mongoose.Schema.Types.ObjectId, ref: 'PairCode'}],
    nextPairCode: {type: mongoose.Schema.Types.ObjectId, ref: 'PairCode'},
    createdAt: Date,
    updatedAt: Date,
    isActive: Boolean
});

/***
 * Model class to create an instance of user
 * @method Model
 */
user.Model = mongoose.model('User', user.Schema);
base.extend(user);


/**
 * Finds a user instance by email id
 * @param emailId the email id
 * @return {Q.Promise<T>} a promise which gets resolved into user instance or undefined
 */
user.findByEmail = function (emailId) {
    var query = {
        emailId: emailId
    };
    return this.findOne(query);
};

user.sanitizeQuery = function (query) {
    if(!query)
    return query;

    if(query._id && typeof query._id === 'string'){
        query._id = mongoose.Types.ObjectId(query._id.trim());
    }

    return query;
};