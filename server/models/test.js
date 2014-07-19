/**
 * Created by IronMan on 7/18/14.
 */

var base = require('./base');
var extend = require('extend');
var mongoose = require('mongoose');

var test = module.exports;


test.Schema = mongoose.Schema({
    name: String,
    age: Number
});

test.Model = mongoose.model('Test', test.Schema);

base.extend(test);