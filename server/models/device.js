/**
 * Created by IronMan on 7/16/14.
 */
'use strict';

var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
    name: String,
    type: String,
    model: Date,
    os: String,
    pairCode: {type: mongoose.Schema.Types.ObjectId, ref: 'PairCode'}
});

var Device = mongoose.model('Device', deviceSchema);
exports.Device = Device;