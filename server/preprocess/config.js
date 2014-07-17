/**
 * @module
 * @name db
 * Stores the configuration of the database
 * Created by IronMan on 7/16/14.
 */
var config = module.exports;
config.dbConfig = {
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

config.cryptoConfig = {
    cookies : {
        secret: '0808b74d47f506659db345b11db0edb5a53a2dcda8db858cef2b8df047d907f4'
    }
};
/**
 * Gets the database configuration based on the environment
 * @param env the environment, development or production
 * @returns {*} the configuration for the database
 */
config.getDBConfig = function(env){
    return env === 'development'
        ? config.dbConfig.env.development
        : env === 'production'
        ? config.dbConfig.env.production
        : config.dbConfig.env.development;
};