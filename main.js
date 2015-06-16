//imports

var express = require('express'),
//    mongoose = require('mongoose'),
    stylus = require('stylus'),
    jade = require('jade'),
    logger = require('morgan');
    bodyParser = require('body-parser');
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();


//CONFIG

var path = require('path');
var rootPath = path.normalize(__dirname);
var conString = require('./app/config/connectionString');

//config object
var configObj = {
    development : {
        db : conString[0],
        rootPath: rootPath,
        port: process.env.PORT || 2194,
        siteUrl: "http://localhost:2194/"
    },
    production : {
        db : conString[1],
        rootPath: rootPath,
        port: process.env.PORT || 80,
        siteUrl:"http://funpaste.herokuapp.com/"
    }
};

var config = configObj[env];
console.log(config);

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


//databases

mongoose.connect(config.db);

var database = mongoose.connection;
database.on('error', console.error.bind(console, 'error on connection'));
database.on('open', function(callback){
    console.log("We're in the base.");
});

var pasteSchema = mongoose.Schema({
    content: String,
    upTime: Number,
    removalDate: Number,
    language: String,
    postDate: Date
});

var Paste = mongoose.model('Paste', pasteSchema);

var savePaste = function(paste, callback){

    var dateLimitPrimitive = paste.postDate.getTime() + (paste.upTime * 60 * 1000);

    console.log(paste.postDate.getTime());
    console.log(new Date().getTime());
    console.log(dateLimitPrimitive);

    var saveMe = new Paste({
        content: paste.content,
        upTime: paste.upTime,
        language: paste.language,
        postDate: paste.postDate,
        removalDate: dateLimitPrimitive
    });

    saveMe.save(function(err,item){
        if(err) {
            console.error(err);
            callback(err);
        }
        else {
            callback(null, item);
        }
    });
};

var getPaste = function(pasteId, callback){
    Paste.findById(pasteId, function(err, findMe){
        if(err){
            console.error(err);
            callback(err);
        }
        else {
            callback(null, findMe);
        }
    });
};

var timedKill = function(callback){
    var now = new Date();
    Paste.find()
        .where('removalDate')
            .lt(now.getTime())
        .exec(function(err,docs){
            if (err) {
                callback(true, err);
            }
            else {
                var remove = function(err, removed){
                    if (err){
                        console.log(err);
                        return;
                    }
                    console.log(removed);
                };
                for(var i=0;i < docs.length;i++){
                    Paste.remove({_id: docs[i]._id}, remove);
                }
                callback(false, 'Old entries removed');
            }
        }
    );
};

setInterval(function(){
    console.log('killing time has initiated');
    timedKill(function(hasError, message){
        if (hasError) {
            console.error(message);
        }else {
            console.log(message);
        }
    });
}, 60000);

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
            lang === 'cs' ||
            lang === 'cpp' ||
            lang === 'java' ||
            lang === 'javascript' ||
            lang === 'json' ||
            lang === 'ruby' ||
            lang === 'vb' ||
            lang === 'html' ||
            lang === 'css' ||
            lang === 'stylus' ||
            lang === 'jade' ||
            lang === 'python' ||
            lang === 'sql' ||
            lang === 'md' ||
            lang === 'x86asm'
            )
        {
            return true;
        }else {
            return false;
        }
    };

    if(postContent.content === '' || postContent.upTime < 5 || !validatePostLang(postContent.language)){
        res.send({ success : false });
    }
    else {
        postContent.postDate = new Date();

        //save paste to db and return a page withcurrent paste.

        var savedPaste = savePaste(postContent, function(err, result){
            if (err) {
                res.send({ success : false });
            }
            else {
                console.log(result);
                res.send({success:true,
                    paste:result,
                    siteURL:config.siteUrl});
            }
        });

    }
});

app.get('/index.html', function(req,res){
    res.render('index', {
        pageTitle:'PasteBin'
    });
});

app.get('/paste/:id', function(req,res){
    getPaste(req.params.id, function(err, result){
        if(err || result === null)
        {
            res.send({success:false});
        }
        else {
            res.send(
                {
                    success:true,
                    paste:result
                }
            );
        }
    });
});
app.get('/:id', function(req,res){
    getPaste(req.params.id, function(err, result){
        if(err || result === null)
        {
            res.redirect('/index.html');
        }
        else {
            res.render('pasted',
                {
                    pageTitle:'Paste ' + result._id,
                    pasteId : req.params.id,
                    siteURL : config.siteUrl
                }
            );
        }
    });
});

app.get('*', function(req, res){
    res.render('index', {
        pageTitle:'PasteBin'
    });
});

//networking

app.listen(config.port);
console.log('Listening on port ' + config.port);
