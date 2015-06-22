var should = require('should');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var url = require('../../config/config')[env].siteUrl;

var pasteModel = require('../../models/pastes');


describe('Posting something', function(){
    describe('Typing up a paste', function(){
        it('should post something if i were to correctly fill the form.', function(done){
            browser.get(url);

            var maincontent = 'Automatic tests here';
            var mainuptime = '10';

            element(by.model('main.content')).sendKeys(maincontent);
            element(by.model('main.upTime')).clear();
            element(by.model('main.upTime')).sendKeys(mainuptime);
            element(by.id('linguagens')).click();
            element(by.linkText('Texto Normal')).click();

            element(by.buttonText('Postar')).click().then(function(){
                element(by.id('display')).getText().then(function(text){
                    text.should.be.equal(maincontent);
                    element(by.partialLinkText(url)).getText().then(function(txt){
                        var depurado = txt.substr(url.length);
                        console.log(depurado);
                        depurado.should.ok;
                        depurado.should.be.a.String;
                        depurado.should.be.not.empty;
                        depurado.should.have.length(24);
                        done();
                    });
                });
            });
        });
    });

    describe('Get a paste', function(){
        it('Should give me a page with texties and stuff when right id is passed.', function(done){

            var raw = {
                content: 'oooooooohuuu yehaaaaaa …. sea.. sou.. jhonn macarron.. yeah macarron nooon \n\n Chacarron, Chacarron, Chacarron, Chacarron , ualuealuealeuale ualuelaelaellalea, alsualsualualauusualulus ,,,alsualsualualauusualulus …',
                upTime: 10,
                language: 'normal',
                postDate: new Date()
            };


            pasteModel.savePaste(raw, function(err, result){
                var result;
                if (err) {
                    err.should.not.be.ok;
                    done();
                }else {
                    browser.get(url + result._id);

                    element(by.id('display')).getText().then(function(txt){
                        txt.should.be.ok;
                        txt.should.be.equal(result.content);
                        element(by.partialLinkText(url)).getText().then(function(txt){
                            var depurado = txt.substr(url.length);
                            depurado.should.ok;
                            depurado.should.be.a.String;
                            depurado.should.be.not.empty;
                            depurado.should.have.length(24);
                            done();
                        });
                    });
                }
            });
        });

        it('should redirect to index if paste does not exist', function(done){
            browser.get(url + '89jfdoo');
            browser.getCurrentUrl().then(function(legitUrl){
                should(legitUrl).containEql('index');
                done();
            });
        });
    });
});
