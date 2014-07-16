/**
 * @module
 * @name db
 * Stores the configuration of the database
 * Created by IronMan on 7/16/14.
 */

var dbConfig = {
    env:{
        development: {
            hostName: "localhost",
            databaseName: "development"
        },
        production: {
            hostName: "localhost",
            databaseName: "production"
        }
    }
};

/**
 * Gets the database configuration based on the environment
 * @param env the environment, development or production
 * @returns {*} the configuration for the database
 */
var getDBConfig = function(env){
    return env === 'development' ? dbConfig.env.development : env === 'production' ? dbConfig.env.production : dbConfig.env.development;
};

exports.getDBConfig = getDBConfig;