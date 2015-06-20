process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var assert = require('assert');
var pastesModel = require('../models/pastes');
var mongoose = require('mongoose');


describe('user model', function(){
    describe('validation', function(){
        it('should return true when passed \'normal\'', function(done){
            var param = 'normal';

            var result = pastesModel.validatePostLang(param);

            var expected = true;

            assert.equal(result, expected);

            done();
        });

        it('should return false when passed \'xyzebf\'', function(done){
            var param = 'xyzebf';

            var result = pastesModel.validatePostLang(param);

            var expected = false;

            assert.equal(result, expected);

            done();
        });
    });



});
