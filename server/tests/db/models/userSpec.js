/**
 * Created by IronMan on 7/17/14.
 */

describe('User Model', function(){
    var expect = require('chai').expect;
    var utils = require('../../utils');
    var user = null;
    beforeEach(function(){
        require('../../../app');
        user = require('../../../db/models/user');
    });

    it('should load', function(){
        expect(user).to.not.be.undefined;
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
                done();
            })
            .catch(function(error){
                console.log(error);
                done(error);
            });
    });

    it('should find a user instance from email id', function(done){
        var emailId = 'grisffddf@mailinator.com';
        user.findByEmail(emailId)
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                expect(instance.emailId).to.equal(emailId);
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            })
    });
});