/**
 * Created by IronMan on 7/16/14.
 */

describe('Device Model', function () {
    var expect = require('chai').expect;
    var utils = require('../utils');
    var device = require('../../models/device');
    var pairCode = require('../../models/paircode');
    var mongoose = require('mongoose');
    var user = require('../../models/user');
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
        expect(device).to.not.be.undefined;
        expect(device.create).to.not.be.undefined;
        expect(device.updateOne).to.not.be.undefined;
        expect(device.findOne).to.not.be.undefined;
        expect(device.removeOne).to.not.be.undefined;
    });

    it('should create a device', function (done) {
        var properties = utils.createDevice();
        var uProps = utils.createUser();
        var pProps = utils.createPairCode();

        var uProm = user.create(uProps);
        uProm
            .then(function (userIns) {
                expect(userIns).to.not.be.undefined;

                pProps.userId = userIns._id;
                pairCode.createUntilUnique(pProps)
                    .then(function (pIns) {
                        expect(pIns).to.not.be.undefined
                        properties.userId = userIns._id;
                        properties.pairCodeId = pIns._id;

                        device.create(properties)
                            .then(function (instance) {
                                expect(instance).to.not.be.undefined;
                                expect(instance.userId.toString()).to.equal(userIns._id.toString());
                                expect(instance.pairCodeId.toString()).to.equal(pIns._id.toString());
                                expect(instance.name).to.equal(properties.name);
                                expect(instance.type).to.equal(properties.type);
                                expect(instance.os).to.equal(properties.os);
                                expect(instance.createdAt.toString()).to.equal(properties.createdAt.toString());
                                expect(instance.updatedAt.toString()).to.equal(properties.updatedAt.toString());
                                expect(instance.authToken).to.equal(properties.authToken);
                                expect(instance.isActive).to.be.ok;
                                //instance.remove();
                                pIns.remove();
                                userIns.remove();
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

            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });

    });
});