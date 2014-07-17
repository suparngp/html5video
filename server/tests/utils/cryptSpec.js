/**
 * Created by IronMan on 7/17/14.
 */

describe('Crypt utility', function(){
    var crypt = require('../../utils/crypt');
    var Faker = require('faker');
    var expect = require('chai').expect;

    describe('namespace password', function(){
        it('should hash a password', function(){
            var password = Faker.Name.firstName();
            var hash = crypt.password.hash(password);
            expect(hash).to.not.be.undefined;
            expect(hash.length).to.not.equal(0);
        });

        it('should compare the two passwords correctly', function(){
            var password = Faker.Name.firstName();
            var hash = crypt.password.hash(password);
            expect(crypt.password.validate(password, hash)).to.be.ok;
            expect(crypt.password.validate('something', hash)).to.not.be.ok;
        })
    });

    describe('namespace session', function(){
        it('should create a session token', function(){
            var token = crypt.session.token();
            expect(token).to.not.be.undefined;
            expect(token.length).to.not.equal(0);
        });
    });
});