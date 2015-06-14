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
var configObj = {
    development : {
        db : "",
        rootPath: rootPath,
        port: process.env.Port || 2194
    },
    production : {
        db : "",
        rootPath: rootPath,
        port: process.env.Port || 80
    }
};

var config = configObj[env];

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

app.get('/partials/*', function(req,res){
    res.render('../../public/app/'+req.params[0]);
});

app.post('/create', function(req,res){
    postContent = {
        content: req.body.content,
        upTime: req.body.upTime,
        language: req.body.language,
        postDate : null
    };

    //validatePost

    validatePostLang = function(lang){
        if (lang === 'normal' ||
            lang === 'c' ||
            lang === 'c#' ||
            lang === 'java' ||
            lang === 'javascript' ||
            lang === 'json' ||
            lang === 'ruby' ||
            lang === 'ruby-rails' ||
            lang === 'c++' ||
            lang === 'vb' ||
            lang === 'F#' ||
            lang === 'html' ||
            lang === 'css' ||
            lang === 'stylus' ||
            lang === 'jade' ||
            lang === 'python' ||
            lang === 'sql' ||
            lang === 'md' ||
            lang === 'assembly'
            )
        {
            return true;
        }else {
            return false;
        }
    };
    console.log(validatePostLang);

    if(postContent.content === '' || postContent.upTime < 5 || !validatePostLang(postContent.language)){
        console.log(postContent);
        console.log(postContent.content === '' );
        console.log(postContent.upTime < 5);
        console.log(!validatePostLang(postContent.lang));
        console.error('failed');
        res.send({success:false});
    }
    else {
        postContent.postDate = new Date();

        console.log(postContent);
        //save paste to db and return a page withcurrent paste.

        res.send({success:true});
    }
});

app.get('/paste', function(req,res){

});

app.get('/:id', function(req,res){

});

app.get('*', function(req, res){
    res.render('index', {
        pageTitle:'Index'
    });
});

// busisness, i guess




//networking

app.listen(config.port);
console.log('Listening on port ' + config.port);
