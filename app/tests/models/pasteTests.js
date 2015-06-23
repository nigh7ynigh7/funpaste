var pastesModel = require('../../models/pastes');
var should = require('should');

module.exports = function() {
    describe('user model', function() {
        describe('validation', function() {
            var validations = [
                'normal',
                'c',
                'cs',
                'cpp',
                'java',
                'javascript',
                'json',
                'ruby',
                'vb',
                'html',
                'css',
                'stylus',
                'jade',
                'python',
                'sql',
                'md',
                'x86asm'
            ];

            validations.forEach(function(input) {
                it('should return true when passed : ' + input, function(done) {
                    var result = pastesModel.validatePostLang(input);

                    var expected = true;

                    (result).should.be.true;

                    done();
                });
            });



            it('should return false when passed \'xyzebf\'', function(done) {
                var param = 'xyzebf';

                var result = pastesModel.validatePostLang(param);

                (result).should.be.false;

                done();
            });
        });


        describe('paste persistance', function() {
            var paste = {};
            var persistedPaste;

            before(function(done){
                paste = {
                    upTime : 10,
                    content : 'Test content, will be removed in 10  minutes.',
                    language : 'normal',
                    postDate : new Date()
                };
                done();
            });


            it('should return a full paste when passed a temp paste', function(done){
                var result;
                pastesModel.savePaste(paste, function(err, rsp){
                    if (err) {
                        result = err;
                    }else {
                        result = rsp;
                    }
                    (result).should.not.be.a.String;
                    (result).should.be.ok;
                    (result).should.be.an.Object;
                    (result).should.have.property('_id');
                    (result).should.have.property('removalDate');
                    done();
                });
            });

            it('should return an error when i paste something with the wrong parameters', function(done){
                var wrongPaste = paste;
                wrongPaste.upTime = undefined;
                wrongPaste.content = undefined;
                var result;
                pastesModel.savePaste(wrongPaste, function(err, rsp){
                    if (err) {
                        result = err;
                    }else {
                        result = rsp;
                    }
                    (err).should.be.ok;
                    should(rsp).not.be.ok;
                    (result).should.be.ok;
                    (result).should.be.a.String;
                    done();
                });
            });
        });

        describe('getting pastes', function(){

            it('should return null or error if 0 is passed as', function(done){
                var result;
                pastesModel.getPaste(0, function(err, res){
                    if (err) {
                        result = err;
                    }else {
                        result = err;
                    }
                    (result).should.not.be.ok;
                    (result).should.not.be.a.String;
                    done();
                });
            });

            it('should return an object if a correct id is passed', function(done){
                var paste = {
                    upTime : 10,
                    content : 'Test get content, will be removed in 10  minutes.',
                    language : 'normal',
                    postDate : new Date()
                };

                pastesModel.savePaste(paste, function(err, result){
                    if (err) {
                        (should).fail('Something went down', err);
                        done();
                    }else {
                        pastesModel.getPaste(result._id , function(err, found){
                            if (err) {
                                (should).fail('Something went down', err);
                                done();
                            }else {
                                (found).should.be.ok;
                                (found).should.be.Object;
                                (found).should.have.property('_id');
                                (found).should.have.property('removalDate');
                                done();
                            }
                        });
                    }
                });
            });
        });

        describe.skip('Removing pastes', function(){
            it('should delete some pastes within one minute of posting', function(done){
                    pastesModel.timedKill(function(isError, msg){
                    if (isError) {
                        (should).fail('Something went down', msg);
                        done();
                    }else {
                        (msg).should.be.ok;
                        (msg).should.be.String;
                        done();
                    }
                });
            });
        });
    });
};
