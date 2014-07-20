/**
 * Created by IronMan on 7/16/14.
 */
'use strict';

var mongoose = require('mongoose');
var base = require('./base');

var device = module.exports;

device.Schema = mongoose.Schema({
    name: String,
    type: String,
    model: String,
    os: String,
    pairCodeId: {type: mongoose.Schema.Types.ObjectId, ref: 'PairCode'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authToken: String,
    createdAt: Date,
    updatedAt: Date,
    isActive: Boolean
});

device.Model = mongoose.model('Device', device.Schema);
base.extend(device);


/**
 * @override
 */
device.sanitizeQuery = function (query) {
    if (!query) return query;

    if (query.pairCodeId && typeof query.pairCodeId === 'string')
        query.pairCodeId = mongoose.Types.ObjectId(query.pairCodeId);

    if (query.userId && typeof query.userId === 'string')
        query.userId = mongoose.Types.ObjectId(query.userId);

    return query;
};
