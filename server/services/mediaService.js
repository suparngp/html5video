/**
 * Created by IronMan on 7/20/14.
 */

var responseError = require('../utils/response-error');

var user = require('../models/user');
var media = require('../models/media');
var Q = require('q');
var http = require('q-io/http');
var logger = require("log4js").getLogger('mediaService');
/**
 * Service for media objects
 * @class mediaService
 * @static
 * */
var mediaService = module.exports;

/**
 * Adds a new media. First creates a new media object in the database.
 * Then adds this new media to the user's media list
 * @method addNewMedia
 * @param params {Object} the params
 *
 *      {
 *          user: {},
 *          media: {}
 *      }
 * @return {Q.Promise<T>}
 */
mediaService.addNewMedia = function (params) {
    var deferred = Q.defer();
    var userInstance = params.user;
    var mediaProps = params.media;

    media.create(mediaProps)
        .then(function (mediaInstance) {
            var update = {
                media: userInstance.media.concat(mediaInstance._id),
                updatedAt: mediaInstance.createdAt
            };
            user.updateOne({_id: userInstance._id}, update)
                .then(function (updatedUser) {
                    params.user = updatedUser;
                    params.media = mediaInstance;
                    deferred.resolve(params);
                })
                .catch(function (error) {
                    logger.error(error);
                    deferred.reject(responseError.INTERNAL_SERVER_ERROR);
                });
        })
        .catch(function (error) {
            logger.error(error);
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        });

    return deferred.promise;
};


/**
 * filters the urls based on the content. Sends a head request for the URL and checks for the content type.
 * @method filterUrls
 * @param params {Object} the params
 *
 *      {
 *          urls: [],
 *          mediaTypes: []
 *      }
 * @return {Q.Promise<T>}
 */
mediaService.filterVideoUrls = function (params) {
    var deferred = Q.defer();
    var urls = params.urls;
    var promises = [];

    urls.forEach(function (url) {
        var options = {
            url: url,
            method: 'HEAD'
        };
        promises.push(http.request(options));
    });
    var counter = 0;
    Q.allSettled(promises)
        .then(function (results) {
            var filteredUrls = [];
            results.forEach(function (result) {
                if (result.state === 'fulfilled') {

                    var contentType = result.value.headers['content-type'];
                    var contentDisposition = result.value.headers['content-disposition'];
                    var fileName = contentDisposition ? getFileName(contentDisposition) : '';

                    isValidMedia({mediaTypes: params.mediaTypes, header: contentType})
                        ? filteredUrls.push({url: urls[counter], fileName: fileName})
                        : null;
                }
                counter++;
            });
            deferred.resolve(filteredUrls);
        })
        .catch(function (error) {
            console.error(error);
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        });
    return deferred.promise;
};

mediaService.addMultipleMedia = function (params) {
    var deferred = Q.defer();
    var mediaList = params.mediaList;
    var user = params.user;

    var promises = [];
    mediaList.forEach(function (media) {
        promises.push(mediaService.addNewMedia({media: media, user: user}));
    });


    Q.allSettled(promises)
        .then(function (results) {
            var resolution = {
                media: []
            };
            for(var i in results){
                if(!results[i] || results[i].state !== 'fulfilled'){
                    continue;
                }
                resolution.media.push(results[i].value.media)
                deferred.resolve(resolution);
            }
        })
        .catch(function (error) {
            logger.error(error);
            deferred.reject(responseError.INTERNAL_SERVER_ERROR);
        });
    return deferred.promise;
};
function isValidMedia(params) {
    var mediaTypes = params.mediaTypes;
    var header = params.header;
    for (var x in mediaTypes) {
        if (header.toLowerCase().indexOf(mediaTypes[x].toLowerCase()) !== -1)
            return true;
    }
    return false;
}

function getFileName(header){
    var tokens = header.split(';');
    for(var x in tokens){
        var token = tokens[x];
        if(token.trim().indexOf('filename') !== -1){
            return token.trim().replace(/filename\s*=/i, '').replace(/\"/gi, "").trim();
        }
    }
    return '';
}