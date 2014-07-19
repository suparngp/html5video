/**
 * Created by IronMan on 7/17/14.
 */

describe('User Model', function(){
    var expect = require('chai').expect;
    var utils = require('../utils');
    var user = null;
    var faker = require('faker');
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

    beforeEach(function(){
        require('../../app');
        user = require('../../models/user');
    });

    it('should load with all the methods', function(){
        expect(user).to.not.be.undefined;
        expect(user.create).to.not.be.undefined;
        expect(user.findOne).to.not.be.undefined;
        expect(user.updateOne).to.not.be.undefined;
        expect(user.removeOne).to.not.be.undefined;
    });

    it('should create a new user instance', function(done){
        var properties = utils.createUser();
        var promise = user.create(properties);

        //noinspection JSUnresolvedFunction
        promise.then(function(instance){
                expect(instance).to.not.be.undefined;
                expect(instance.firstName).to.not.be.undefined;
                expect(instance.lastName).to.not.be.undefined;
                expect(instance.country).to.not.be.undefined;
                expect(instance.emailId).to.not.be.undefined;
                expect(instance.password).to.not.be.undefined;
                expect(instance.createdAt).to.not.be.undefined;
                expect(instance.updatedAt).to.not.be.undefined;
                expect(instance.isActive).to.be.ok;
                expect(instance.pairCodes).to.not.be.undefined;
                expect(instance.pairCodes.length).to.equal(0);
                expect(instance.media).to.not.be.undefined;
                expect(instance.media.length).to.equal(0);
                expect(instance.devices).to.not.be.undefined;
                expect(instance.devices.length).to.equal(0);
                expect(instance.nextPairCode).to.equal(null);
                instance.remove();
                done();
            })
            .catch(function(error){
                console.log(error);
                done(error);
            });
    });

    it('should find a user instance from email id', function(done){

        var properties = utils.createUser();
        var emailId = properties.emailId;
        user.create(properties)
            .then(function () {
                user.findByEmail(emailId)
                    .then(function (instance) {
                        expect(instance).to.not.be.undefined;
                        expect(instance.emailId).to.equal(emailId);
                        instance.remove();
                        done();
                    })
                    .catch(function (error) {
                        console.log(error);
                        done(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });

    it('should update user', function (done) {
        var properties = utils.createUser();
        user.create(properties)
            .then(function (instance) {

                var fName = faker.Name.firstName();
                user.updateOne({emailId: instance.emailId, _id: instance._id.toString()}, {firstName: fName}, {'new': true})
                    .then(function (ins) {
                        expect(ins._id.toString()).to.equal(instance._id.toString());
                        expect(ins.emailId).to.equal(instance.emailId);
                        expect(ins.firstName).to.equal(fName);
                        ins.remove();
                        done();
                    })
                    .catch(function (error) {
                        console.log(error);
                        done(error);
                    })

            })
            .catch(function (error) {
                console.log(error);
                done(error);
            })
    });

    it('should remove user', function (done) {
        var properties = utils.createUser();
        user.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                user.removeOne({_id: instance._id})
                    .then(function (ins) {
                        expect(ins).to.not.be.undefined;
                        user.findOne({emailId: instance.emailId})
                            .then(function(inst){
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

    it('should find user by email Id', function (done) {
        var properties = utils.createUser();
        user.create(properties)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                user.findByEmail(properties.emailId)
                    .then(function (ins) {
                        expect(ins).to.not.be.undefined;
                        expect(ins.emailId).to.equal(instance.emailId);
                        expect(ins._id.toString()).to.equal(instance._id.toString());
                        instance.remove();
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
});