/**
 * Created by IronMan on 7/16/14.
 */

'use strict';
var mongoose = require('mongoose');
var base = require('./base');
var media = module.exports;

media.Schema = mongoose.Schema({
    name: String,
    sourceUrl: String,
    url: String,
    fileName: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
    updatedAt: Date,
    isActive: Boolean
});

media.Model = mongoose.model('Media', media.Schema);

base.extend(media);