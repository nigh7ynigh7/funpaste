var stylus = require('stylus');
var jade = require('jade');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');

module.exports = function(app,config){
    function compile(str, path){
        return stylus(str).set('filename', path);
    }

    app.set('views', config.rootPath + "/app/views");
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(bodyParser());
    app.use(stylus.middleware({
        src: config.rootPath + '/public',
        compile: compile
    }));
    app.use(express.static(config.rootPath + '/public'));
};
