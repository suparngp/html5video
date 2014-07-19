/**
 * Initialization module to bootstrap the app
 * Created by IronMan on 7/16/14.
 */

var config = require('./config');
var mongoose = require('mongoose');
var logger = require('winston');
var connection = null;
var Q = require('q');


/**
 * Loads the database connection.
 * @param env the environment, development or production
 * @return {Q.Promise<T>} a promise which is rejected if the database connection fails,
 * or resolved if connection is successful.
 */
var loadDBConnection = function (env) {
    var defer = Q.defer();
    var dbConfig = config.getDBConfig(env);
    mongoose.connection.close();
    mongoose.connect('mongodb://' + dbConfig.hostName + '/' + dbConfig.databaseName);
    var connection = mongoose.connection;

    connection.once('error', function(error){
        logger.error(error);
        logger.error('Unable to connect to mongodb');
        defer.reject({reason: 'Unable to connect to mongodb'});
    });

    connection.once('connected', function(){
        console.log('connected');
        logger.info("Connected to mongodb");
        defer.resolve({reason: "Connected to mongodb"});
    });

    connection.on('disconnected', function(){
        console.log('disconnected');
    });
    return defer.promise;
};

exports.loadDBConnection = loadDBConnection;