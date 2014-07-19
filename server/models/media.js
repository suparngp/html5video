/**
 * Created by IronMan on 7/16/14.
 */

'use strict';
var mongoose = require('mongoose');

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