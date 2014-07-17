/**
 * Created by IronMan on 7/17/14.
 */
describe('Session Model', function(){
    var expect = require('chai').expect;
    var utils = require('../../utils');
    var session = null;
    beforeEach(function(){
        require('../../../app');
        session = require('../../../db/models/session');
    });

    it('should load', function(){
        expect(session).to.not.be.undefined;
    });

    it('should create a new session instance', function(done){
        var properties = utils.createSession();
        var promise = session.create(properties);

        promise.then(function(instance){
                expect(instance).to.not.be.undefined;
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
});