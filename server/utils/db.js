/**
 * Created by IronMan on 7/17/14.
 */

var db = module.exports;
var mongoose = require('mongoose');
db.types = {};

/**
 * Converts a string into database id or returns a new id
 * @param id the id to be converted
 * @return {mongoose.Types.ObjectId} the objectId
 * @constructor
 */
db.types.ObjectId = function(id){
    return id ? mongoose.Types.ObjectId(id) : mongoose.Types.ObjectId();
};