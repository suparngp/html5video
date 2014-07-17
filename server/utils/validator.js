/**
 * Created by IronMan on 7/16/14.
 */

var validate = module.exports;
var validator = require('validator');
validate.email = function(emailId){
    return validator.isEmail(emailId);
};

validate.password = function(password){
    if(!password)return false;
    return !(password.length < 6 || password.length > 14);
};

validate.name = function(name){
    return !(!name || name.length === 0);

};

validate.country = function(country){
    return !(!country || country.length === 0);
};