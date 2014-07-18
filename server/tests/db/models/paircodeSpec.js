/**
 * Created by IronMan on 7/16/14.
 */


describe('PairCode Model', function(){
    var expect = require('chai').expect;

    var pairCode = null;
    var mongoose = require('mongoose');
    var paircodeUtils = require('../../../utils/paircodeUtils');
    beforeEach(function(){
        require('../../../app');
        pairCode = require('../../../db/models/paircode');
    });

    it('should load', function(){
        pairCode = require('../../../db/models/paircode');
        expect(pairCode).to.not.be.undefined;
    });

    it('should create a new pair code', function(done){
        var properties = {
            key: paircodeUtils.generateRandomPairKey(),
            passcode: paircodeUtils.generateRandomPassword(),
            userId: require('mongoose').Types.ObjectId(),
            createdAt: new Date()
        };
        var promise = pairCode.create(properties);

        promise.then(function(instance){
                expect(instance).to.not.be.undefined;
                expect(instance.key).to.not.be.undefined;
                expect(instance.passcode).to.not.be.undefined;
                expect(instance.userId).to.not.be.undefined;
                expect(instance.createdAt).to.not.be.undefined;
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });

    it('should create till unique', function(done){
        var userId = mongoose.Types.ObjectId();
        pairCode.createUntilUnique(userId)
            .then(function(instance){
                expect(instance).to.not.be.undefined;
                expect(instance.key).to.not.be.undefined;
                expect(instance.passcode).to.not.be.undefined;
                expect(instance.userId).to.not.be.undefined;
                expect(instance.createdAt).to.not.be.undefined;
                done();
            }, function(){
                expect(false).to.be.ok;
                done();
            });
    });
});