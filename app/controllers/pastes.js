var pastesModel = require('../models/pastes');
var Promise = require('promise');

module.exports.createPastes = function(paste) {
    return new Promise(function(fulfill, reject) {
        var postContent = {
            content: paste.content,
            upTime: paste.upTime,
            language: paste.language,
            postDate: null
        };
        if (postContent.content === '' || postContent.upTime < 5 || !pastesModel.validatePostLang(postContent.language)) {
            return reject('Invalid');
        } else {
            postContent.postDate = new Date();

            pastesModel.savePaste(postContent, function(err, result) {
                if (err) {
                    return reject(err);
                } else {
                    return fulfill(result);
                }
            });
        }
    });
};


module.exports.getPaste = function(id) {
    return new Promise(function(fulfill, reject) {
        pastesModel.getPaste(id, function(err, result) {
            if (err || result === null) {
                if (err) {
                    return reject(err);
                }
                return reject(null);
            } else {
                return fulfill(result);
            }
        });
    });
};
