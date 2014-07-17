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
                done();
            },
            function(error){
                console.log(error);
                done(error);
            })
            .catch(function(error){
                console.log(error);
                done();
            });
    });
});