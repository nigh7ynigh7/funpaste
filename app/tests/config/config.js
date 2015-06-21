var should = require('should');
var config = require('../../config/config');

module.exports = function(){
    describe('configuration file', function(){
        describe('comparison with data based on environment', function(){

            var tries = ['production','development','test'];

            tries.forEach(function(item){
                it('should be a config file for each item in array of'+item, function(done){
                    var configFile = config[item];

                    configFile.should.be.ok;
                    configFile.should.be.an.Object;
                    configFile.should.have.property('db');
                    configFile.should.have.property('rootPath');
                    configFile.should.have.property('port');
                    configFile.should.have.property('siteUrl');
                    (configFile.db).should.be.a.ok;
                    (configFile.db).should.be.a.String;
                    (configFile.rootPath).should.be.a.ok;
                    (configFile.rootPath).should.be.a.String;
                    (configFile.port).should.be.a.ok;
                    (configFile.port).should.be.a.Number;
                    (configFile.siteUrl).should.be.a.ok;
                    (configFile.siteUrl).should.be.a.String;

                    done();
                });
            });
        });
    });
};
