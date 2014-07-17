/**
 * Created by IronMan on 7/17/14.
 */


var session = module.exports;

var mongoose = require('mongoose');
var crypt = require('../../utils/crypt');
var Q = require('q');
session.sessionSchema = mongoose.Schema({
    token: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
    updatedAt: Date
});

session.Session = mongoose.model('Session', session.sessionSchema);

/**
 * Creates a session instance
 * @param properties the properties of the session
 * @return {Q.Promise<T>} the promise which gets resolved into session instance
 */
session.create = function (properties) {
    var defer = Q.defer();
    var instance = new session.Session(properties);
    instance.save(function (err, instance) {
        if(err){
            defer.reject({reason: err});
        }
        else{
            defer.resolve(instance);
        }
    });
    return defer.promise;
};