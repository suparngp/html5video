/**
 * Created by IronMan on 7/16/14.
 */

describe('Device Model', function(){
    var expect = require('chai').expect;

    var device = null;
    beforeEach(function(){
        require('../../app');
        device = require('../../models/device');
    });

    it('should load', function(){
        expect(device).to.not.be.undefined;
    });
});