/**
 * Created by IronMan on 7/16/14.
 */

'use strict';
var globals = require('../../globals/globals');
var mongoose = globals.getDBConnection();

var mediaSchema = mongoose.Schema({
    name: String,
    sourceUrl: String,
    url: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
    updatedAt: Date
});

var Media = mongoose.model('Media', mediaSchema);

exports.Media = Media;