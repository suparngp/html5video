/**
 * Created by IronMan on 7/16/14.
 */

describe('Module init.js', function () {

    var init;
    var expect = require('chai').expect;
    beforeEach(function () {
        init = require('../../preprocess/init');
    });

    it('should load properly', function () {
        expect(init).to.not.be.undefined;
    });

    it('should connect to mongodb', function (done) {
        var promise = init.loadDBConnection('development');
        promise.then(function () {
            expect(require('mongoose').connection.readyState).to.equal(1);
            done();
        }, function (error) {
            console.log('weird: ' + error);
            expect(require('mongoose').connection.readyState).to.equal(1);
            done();
        }).catch(function(err){
            console.log(err);
        })
    });
});