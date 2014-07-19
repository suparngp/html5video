/**
 * Created by IronMan on 7/18/14.
 */

var test = require('../../models/test');
var Q = require('q');
var init = require('../../preprocess/init');
xdescribe('Test model', function () {
    var expect = require('chai').expect;

    before(function (done) {
        var promise = init.loadDBConnection('development');
        promise.then(function () {
            done();
        })
            .catch(function (error) {
                done(error);
            });
    });

    it('should have all the methods', function () {
        expect(test).not.to.be.undefined;
        expect(test.create).not.to.be.undefined;
        expect(test.findOne).not.to.be.undefined;
        expect(test.updateOne).not.to.be.undefined;
        expect(test.removeOne).not.to.be.undefined;
        expect(test).not.to.be.undefined;

    });

    it('Should create a new test instance', function (done) {
        var promise = test.create({name: 'suparn', age: 12});
        promise
            .then(function (instance) {
                expect(instance).to.not.be.undefined;
                done();
            })
            .catch(function (error) {
                console.log(error);
                done(error);
            });
    });

    it('should remove an instance', function (done) {
        var promise = test.removeOne({name: 'suparn'});
        promise.then(function (instance) {
            expect(instance).to.not.be.undefined;
            done();
        })
            .catch(function (error) {
                console.log(error);
                done(error);
            })
    });

    it('should find an instance', function(done){
        var promise = test.create({name: 'Suparn', age: 10});
        promise.then(function (instance) {
            var id = instance._id;

            test.findOne({_id: id}).then(function (instance) {
                expect(instance).to.not.be.undefined;
                expect(instance._id.toString()).to.equal(id.toString());
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

    it('should update an instance', function(done){
        var promise = test.create({name: 'Suparn', age: 10});
        promise.then(function (instance) {
            var id = instance._id;

            test.updateOne({_id: id}, {age: 18}, {'new': true}).then(function (instance) {
                expect(instance).to.not.be.undefined;
                expect(instance._id.toString()).to.equal(id.toString());
                expect(instance.age).to.equal(18);
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
});