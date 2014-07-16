/**
 * Schema for user
 * Created by IronMan on 7/16/14.
 */

'use strict';

var globals = require('../../globals/globals');
var mongoose = globals.getDBConnection();

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    country: String,
    emailId: String,
    password: String,
    devices: {type: mongoose.Schema.Types.ObjectId, ref: 'Device'},
    media: [],
    pairCodes: [],
    nextPairCode: {type: mongoose.Schema.Types.ObjectId, ref: 'PairCode'},
    createdAt: Date,
    updatedAt: Date,
    isActive: Boolean
});

var User = mongoose.model('User', userSchema);

exports.User = User;