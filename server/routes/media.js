/**
 * Created by IronMan on 7/20/14.
 */

var express = require('express');
var router = express.Router();
var responseError = require('../utils/response-error');
var mediaService = require('../services/mediaService');
var mediaTypes = require('../utils/media-types');
var logger = require("log4js").getLogger('media-route');
var sanitize = require('../utils/sanitize');

router.route('/beam')
    .post(function (req, res, next) {
        var data = req.body;
        if (!data || !data.sourceUrl || !data.urls) {
            next(responseError.MISSING_FIELDS);
            return;
        }

        mediaService.filterVideoUrls({urls: data.urls, mediaTypes: mediaTypes})
            .then(function (filteredUrls) {
                var date = new Date();
                filteredUrls.forEach(function (value, index, arr) {
                    arr[index].sourceUrl = data.sourceUrl;
                    arr[index].name = data.name ? data.name : value.fileName;
                    arr[index].fileName = value.fileName;
                    arr[index].userId = req.tv.user._id;
                    arr[index].createdAt = date;
                    arr[index].updatedAt = date;
                    arr[index].isActive = true;
                });

                mediaService.addMultipleMedia({mediaList: filteredUrls, user: req.tv.user})
                    .then(function (results) {
                        res.json(results.media.map(function (value) {
                            return sanitize.media(value);
                        }));
                    })
                    .catch(function (error) {
                        next(error);
                    })
                    .done();
            })
            .catch(function (error) {
                next(error);
            })
            .done();
    });

module.exports = router;