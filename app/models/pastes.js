var config = require('../config/config')[process.env.NODE_ENV];
var mongoose = require('mongoose');

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

module.exports.savePaste = function(paste, callback){

    var dateLimitPrimitive = paste.postDate.getTime() + (paste.upTime * 60 * 1000);

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

module.exports.getPaste = function(pasteId, callback){
    Paste.findById(pasteId, function(err, found){
        if(err){
            console.error(err);
            callback(err);
        }
        else {
            callback(null, found);
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
                        return;
                    }
                };
                for(var i=0;i < docs.length;i++){
                    Paste.remove({_id: docs[i]._id}, remove);
                }
                callback(false, 'Old entries removed');
            }
        }
    );
};


module.exports.timedKill = timedKill;

module.exports.initiateTimedKill = function(){
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
};

//validate languages
module.exports.validatePostLang = function(lang){
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
