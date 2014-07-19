/**
 * Created by IronMan on 7/17/14.
 */
describe('Session Model', function () {
    var expect = require('chai').expect;
    var utils = require('../utils');
    var session = null;
    var mongoose = require('mongoose');
    var init = require('../../preprocess/init');
    before(function (done) {
        var promise = init.loadDBConnection('development');
        promise.then(function () {
            done();
        })
            .catch(function (error) {
                done(error);
            });
    });

    beforeEach(function () {
        require('../../app');
        session = require('../../models/session');
    });

    it('should load', function () {
        expect(session).to.not.be.undefined;
        expect(session.create).to.not.be.undefined;
        expect(session.findOne).to.not.be.undefined;
        expect(session.updateOne).to.not.be.undefined;
        expect(session.removeOne).to.not.be.undefined;
        expect(session.findOrCreate).to.not.be.undefined;
    });

    it('should create a new session instance', function (done) {
        var properties = utils.createSession();
        var promise = session.create(properties);

        promise.then(function (instance) {
            expect(instance).to.not.be.undefined;
            expect(instance.token).to.not.be.undefined;
            expect(instance.userId).to.not.be.undefined;
            expect(instance.createdAt).to.not.be.undefined;
            expect(instance.updatedAt).to.not.be.undefined;
            expect(instance._id).to.not.be.undefined;
            instance.remove();
            done();
        })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });

    it('should find or create the session instance', function (done) {
        var properties = utils.createSession();
        session.findOrCreate({userId: properties.userId.toString()})
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                expect(instance.token).to.not.be.undefined;
                expect(instance.userId.toString()).to.not.be.undefined;
                expect(instance.createdAt.toString()).to.not.be.undefined;
                expect(instance.updatedAt).to.not.be.undefined;
                expect(instance._id.toString()).to.not.be.undefined;
                instance.remove();
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });

    it('should update the session', function (done) {
        var properties = utils.createSession();
        session.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                console.log(instance);
                var update = {
                    updatedAt: new Date('04-17-1991')
                };

                session.updateOne({userId: instance.userId.toString()}, update, {'new': true})
                    .then(function (ins) {
                        console.log(ins);
                        expect(ins).to.not.be.undefined;
                        expect(ins._id.toString()).to.equal(instance._id.toString());
                        expect(ins.userId.toString()).to.equal(instance.userId.toString());
                        expect(ins.updatedAt.toString()).to.equal(update.updatedAt.toString());
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

    it('should remove the session', function (done) {
        var properties = utils.createSession();
        session.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                var query = {
                    token: properties.token
                };
                session.removeOne(query)
                    .then(function (ins) {
                        expect(ins).to.not.be.undefined;
                        expect(ins._id.toString()).to.equal(instance._id.toString());

                        session.findOne(query)
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

    it('should find the session', function (done) {
        var properties = utils.createSession();
        session.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                var query = {
                    token: properties.token
                };
                session.findOne(query)
                    .then(function (inst) {
                        expect(inst).to.not.be.undefined;
                        expect(inst._id.toString()).to.equal(instance._id.toString());
                        expect(inst.userId.toString()).to.equal(instance.userId.toString());
                        expect(inst.token).to.equal(instance.token);
                        inst.remove();
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