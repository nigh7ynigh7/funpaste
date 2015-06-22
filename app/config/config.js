var path = require('path');
var rootPath = path.normalize(__dirname +'/../../');
var conString = require('./connectionString');

//config object
module.exports = configObj = {
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
    },
    test : {
        db : conString[2],
        rootPath: rootPath,
        port: process.env.PORT || 80,
        siteUrl:"http://localhost:2194/"
    }
};
