//imports

var express = require('express'),
//    mongoose = require('mongoose'),
    stylus = require('stylus'),
    jade = require('jade'),
    logger = require('morgan');
    bodyParser = require('body-parser');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();






//CONFIG

var path = require('path');
var rootPath = path.normalize(__dirname);

//config object
var config = {
    // development : {
        db : "",
        rootPath: rootPath,
        port: process.env.Port || 2194
    // },
    // production : {
    //     db : "",
    //     rootPath: rootPath,
    //     port: process.env.Port || 80
    // }
};

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




//routes

app.get('*', function(req, res){
    res.render('index', {
        pageTitle:'Index'
    });
});
app.post('create', function(req,res){

});


//networking

app.listen(config.port);
console.log('Listening on port ' + config.port);
