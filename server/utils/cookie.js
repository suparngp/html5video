/**
 * Created by IronMan on 7/18/14.
 */

var cookie = module.exports;

cookie.clear = {};
cookie.clear.session = function (res) {
    res.clearCookie('user_id');
    res.clearCookie('token');
};

cookie.create = {};
cookie.create.session = function (res, userId, token) {
    res.cookie('token', token, {signed: true});
    res.cookie('user_id', userId, {signed: true});
};