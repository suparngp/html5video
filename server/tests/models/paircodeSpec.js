/**
 * Created by IronMan on 7/16/14.
 */


describe('PairCode Model', function () {
    var expect = require('chai').expect;
    var utils = require('../utils');
    var pairCode = require('../../models/paircode');
    var mongoose = require('mongoose');
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
        pairCode = require('../../models/paircode');
        expect(pairCode).to.not.be.undefined;
        expect(pairCode.create).to.not.be.undefined;
        expect(pairCode.findOne).to.not.be.undefined;
        expect(pairCode.updateOne).to.not.be.undefined;
        expect(pairCode.removeOne).to.not.be.undefined;
        expect(pairCode.createUntilUnique).to.not.be.undefined;
    });

    it('should create a new pair code', function (done) {
        var properties = utils.createPairCode();
        pairCode.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                expect(instance.key).to.equal(properties.key);
                expect(instance.passcode).to.equal(properties.passcode);
                expect(instance.userId.toString()).to.equal(properties.userId.toString());
                expect(instance.createdAt.toString()).to.equal(properties.createdAt.toString());
                instance.remove();
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            })
            .done();
    });

    it('should create till unique', function (done) {
        var userId = mongoose.Types.ObjectId();
        pairCode.createUntilUnique({userId: userId})
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                expect(instance.key).to.not.be.undefined;
                expect(instance.passcode).to.not.be.undefined;
                expect(instance.userId).to.not.be.undefined;
                expect(instance.createdAt).to.not.be.undefined;
                instance.remove();
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            })
            .done();
    });

    it('should find a pair code', function (done) {
        var properties = utils.createPairCode();
        pairCode.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                pairCode.findOne({_id: instance._id.toString(), key: instance.key})
                    .then(function (ins) {
                        expect(ins).to.not.be.undefined;
                        expect(instance._id.toString()).to.equal(ins._id.toString());
                        expect(instance.key).to.equal(ins.key);
                        expect(instance.passcode).to.equal(ins.passcode);
                        ins.remove();
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

    it('should update a pair code', function (done) {
        var properties = utils.createPairCode();
        pairCode.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                pairCode.updateOne({_id: instance._id.toString(), key: instance.key}, {passcode: '0000'}, {'new': true})
                    .then(function (ins) {
                        expect(ins).to.not.be.undefined;
                        expect(instance._id.toString()).to.equal(ins._id.toString());
                        expect(instance.key).to.equal(ins.key);
                        expect(ins.passcode).to.equal('0000');
                        ins.remove();
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

    it('should remove a pair code', function (done) {
        var properties = utils.createPairCode();
        pairCode.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                var query = {
                    key: properties.key
                };
                pairCode.removeOne(query)
                    .then(function (ins) {
                        expect(ins).to.not.be.undefined;
                        expect(ins._id.toString()).to.equal(instance._id.toString());

                        pairCode.findOne(query)
                            .then(function (inst) {
                                expect(inst).to.equal(null);
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