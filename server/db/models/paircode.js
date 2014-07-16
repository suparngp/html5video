/**
 * Created by IronMan on 7/16/14.
 */

'use strict';
var globals = require('../../globals/globals');
var mongoose = globals.getDBConnection();

var paircodeSchema = mongoose.Schema({
    key: String,
    passcode: String,
    createdAt: Date,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var PairCode = mongoose.model('PairCode', paircodeSchema);
exports.PairCode = PairCode;