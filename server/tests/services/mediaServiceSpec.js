/**
 * Created by IronMan on 7/20/14.
 */

describe('mediaService', function () {
    var expect = require('chai').expect;
    var mediaService = require('../../services/mediaService');

    it('should filter urls', function (done) {
        var params = {
            urls: [
                'http://video-js.zencoder.com/oceans-clip.mp4',
                'http://video-js.zencoder.com/oceans-clip.webm',
                'http://video-js.zencoder.com/oceans-clip.ogv',
                'http://video-js.zencoder.com/oceans-clip.png',
                'http://media-a503.firedrive.com/stream/52/the_time_machine_2002_divx_eng.flv?h=xHpQKsDQUybpHsr7mR3ehQ&e=1405920607&f=the_time_machine_2002_divx_eng.flv.flv&domain=firedrive.com'
            ],
            mediaTypes: [
                'video'
            ]
        };
        mediaService.filterVideoUrls(params)
            .then(function (results) {
                console.log(results);
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    })
});