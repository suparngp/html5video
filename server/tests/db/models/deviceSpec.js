/**
 * Created by IronMan on 7/16/14.
 */

describe('Device Model', function(){
    var expect = require('chai').expect;

    var device = null;
    beforeEach(function(){
        require('../../../app');
        device = require('../../../db/models/device');
    });

    it('should load', function(){
        device = require('../../../db/models/device');
        expect(device).to.not.be.undefined;
    });
});