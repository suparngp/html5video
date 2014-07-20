/**
 * Created by IronMan on 7/19/14.
 */

describe.only('Pairing Service', function () {
    var pairingService = require('../../services/pairingService');
    var expect = require('chai').expect;
    var paircode = require('../../models/paircode');
    var user = require('../../models/user');
    var device = require('../../models/device');
    var utils = require('../utils');
    var init = require('../../preprocess/init');

    before(function (done) {
        var promise = init.loadDBConnection('development');
        promise
            .then(function () {
                done();
            })
            .catch(function (error) {
                done(error);
            });
    });

    it('should load', function () {
        expect(pairingService).to.not.be.undefined;
        expect(pairingService.createNewPairCode).to.not.be.undefined;
    });

    it('should create a new pair code', function (done) {
        var userProps = utils.createUser();
        user.create(userProps)
            .then(function (userInstance) {
                pairingService.createNewPairCode(userInstance)
                    .then(function (result) {
                        expect(result).to.not.be.undefined;
                        expect(result.user).to.not.be.undefined;
                        expect(result.pairCode).to.not.be.undefined;
                        expect(result.pairCode._id.toString()).to.equal(result.user.nextPairCode.toString());
                        result.user.remove();
                        result.pairCode.remove();
                        done();
                    })
                    .catch(function (error) {
                        console.log(error);
                        done(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });
});