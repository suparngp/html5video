/**
 * Created by IronMan on 7/19/14.
 */

var sanitize = module.exports;

sanitize.user = function (user) {
    var res = user.toJSON();
    res.id = res._id;
    delete res._id;
    delete res.__v;
    return res;
};

sanitize.pairCode = function (pairCode) {
    var clone = pairCode.toJSON();
    delete clone._id;
    delete clone.__v;
    delete clone.isUsed;
    delete clone.createdAt;
    return clone;
};

sanitize.device = function (device) {
    var clone = device.toJSON();
    clone.id = clone._id;
    delete clone._id;
    delete clone.__v;
    delete clone.isActive;
    delete clone.createdAt;
    delete clone.updatedAt;
    delete clone.pairCodeId;
    return clone;
};

sanitize.media = function (media) {
    var clone = media.toJSON();
    clone.id = clone._id;
    delete clone._id;
    delete clone.updatedAt;
    delete clone.__v;
    delete clone.isActive;
    return clone;
};