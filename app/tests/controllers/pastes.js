var pastesController = require('../../controllers/pastes');
var should = require('should');
var Promise = require('promise');



module.exports = function(){
    describe('Controllers test', function(){
        describe('Saving a paste', function(){
            var validPaste = {};
            var invalidPaste = {};
            before(function(done){
                validPaste = {
                    content : 'controller test content for paste',
                    upTime : 5,
                    language : 'normal'
                };
                invalidPaste = {
                    content : '',
                    upTime : 5,
                    language : null
                };
                done();
            });

            it('should return an db paste object if content is a correct paste', function(done){
                var result;
                pastesController.createPastes(validPaste).done(function(res){
                    result = res;
                    should(result).be.ok;
                    should(result).be.an.Object;
                    should(result).have.property('_id');
                    should(result).have.property('removalDate');
                    result.content.should.be.equal(validPaste.content);
                    result.upTime.should.be.equal(validPaste.upTime);
                    result.language.should.be.equal(validPaste.language);
                    done();
                }, function(err){
                    result = err;
                    should(result).should.not.be.ok;
                    done();
                });
            });

            it('should not return a paste object if paste invalid values is passed as a parameter', function(done){
                var result;
                pastesController.createPastes(invalidPaste).done(function(success){
                    should(success).not.ne.ok;
                    done();
                }, function(err){
                    err.should.be.ok;
                    err.should.be.a.String;
                    done();
                });
            });

            if('should not return a paste if object has more properties than predefined', function(done){
                var testObj = validPaste;
                testObj.theAnswerToEveryQuestion = 42;
                testObj.lackOfWords = '';

                pastesController.createPastes(invalidPaste).done(function(success){
                    should(success).not.be.an.Object();
                    done();
                }, function(err){
                    err.should.be.ok;
                    done();
                });
            });
        });

        describe('Getting pastes', function(){
            var fakeId = 0;
            var legitId;
            var createdObj;

            before(function(done){
                var validPaste = {
                    content : 'controller test content for paste',
                    upTime : 10,
                    language : 'normal'
                };
                pastesController.createPastes(validPaste).done(function(result){
                    legitIt = result._id;
                    createdObj = result;
                });
                done();
            });

            it('should return an object if an existing id is passed', function(done){

                pastesController.getPaste(legitId).done(function(result){

                    should(createdObj).be.ok;
                    should(createdObj).be.an.Object;
                    should(createdObj).be.equal(result);
                    should(createdObj._id).be.equal(legitId);
                    done();

                }, function(err){

                    if (err) {
                        err.should.not.be.ok;
                        done();
                    }else {
                        should(err).not.be.null;
                        done();
                    }

                });

            });

            it('should return nothing if an invalid id is passed', function(done){

                pastesController.getPaste(legitId).done(function(result){

                    should.fail('How could this have happened');
                    done();

                }, function(err){

                    if (err === null) {
                        should(err).not.be.ok;
                        should(err).be.null;
                        done();
                    }else {
                        err.should.be.ok;
                        err.should.be.a.String;
                        done();
                    }

                });

            });
        });
    });
};
