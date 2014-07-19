/**
 * Created by IronMan on 7/17/14.
 */
describe('Session Model', function(){
    var expect = require('chai').expect;
    var utils = require('../utils');
    var session = null;
    var mongoose = require('mongoose');
    beforeEach(function(){
        require('../../app');
        session = require('../../models/session');
    });

    it('should load', function(){
        expect(session).to.not.be.undefined;
    });

    it('should create a new session instance', function(done){
        var properties = utils.createSession();
        var promise = session.create(properties);

        promise.then(function(instance){
                expect(instance).to.not.be.undefined;
                expect(instance.token).to.not.be.undefined;
                expect(instance.userId).to.not.be.undefined;
                expect(instance.createdAt).to.not.be.undefined;
                expect(instance.updatedAt).to.not.be.undefined;
                expect(instance._id).to.not.be.undefined;
                done();
            },
            function(error){
                console.log(error);
                done(error);
            })
            .catch(function(error){
                console.log(error);
                done(error);
            });
    });

    it('should find the session instance', function(done){
        var promise = session.findOrCreate(mongoose.Types.ObjectId('53c7a3c71b52f22a599376d7'));
        promise.then(function(instance){
            console.log(instance);
            expect(instance).to.not.be.undefined;
            expect(instance.token).to.not.be.undefined;
            expect(instance.userId).to.not.be.undefined;
            expect(instance.createdAt).to.not.be.undefined;
            expect(instance._id).to.not.be.undefined;
            done();
        }, function(error){
            console.log(error);
            done(error);
        })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });
});