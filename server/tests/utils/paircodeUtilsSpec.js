/**
 * Created by IronMan on 7/17/14.
 */


describe('Pair Code Utils', function () {

    var paircodeUtils = require('../../utils/paircodeUtils');
    var expect = require('chai').expect;

    it('should load', function () {
        expect(paircodeUtils).to.not.be.undefined;
    });

    it('should have all the methods', function () {
        expect(paircodeUtils.generateRandomPairKey).to.not.be.undefined;
        expect(paircodeUtils.generateRandomPassword).to.not.be.undefined;
    });

    it('should generate 6 digit pair key', function () {
        var random = paircodeUtils.generateRandomPairKey();
        expect(random).to.not.be.undefined;
        expect(random.length).to.equal(6);
    });

    it('should generate 4 digit password', function(){
        var random = paircodeUtils.generateRandomPassword();
        expect(random).to.not.be.undefined;
        expect(random.length).to.equal(4);
    });
});