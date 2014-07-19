/**
 * Created by IronMan on 7/18/14.
 */


var logger = require("winston");

var Q = require('q');
var mongoose = require('mongoose');

var base = module.exports;

base.extend = function (override) {
    if(!override || !override.Schema || !override.Model){
        throw new Error('Please define Schema and model');
    }

    override.create = function (query) {
        var defer = Q.defer();
        query = this.sanitizeQuery(query);
        var instance = new this.Model(query);
        Q.nfcall(instance.save.bind(instance))
            .then(function (instance) {
                defer.resolve(instance[0]);
            })
            .catch(function (error) {
                defer.reject({reason: error});
            })
            .done();
        return defer.promise;
    };

    override.removeOne = function (query) {
        query = this.sanitizeQuery(query);
        return Q.nfcall(this.Model.findOneAndRemove.bind(this.Model), query);
    };

    override.updateOne = function (query, update, options) {
        query = this.sanitizeQuery(query);
        return Q.nfcall(this.Model.findOneAndUpdate.bind(this.Model), query, update, options);
    };

    override.findOne = function (query) {
        query = this.sanitizeQuery(query);
        return Q.nfcall(this.Model.findOne.bind(this.Model), query);
    };

    override.sanitizeQuery = function (query) {
        return query;
    };

};