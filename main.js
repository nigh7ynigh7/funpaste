var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./app/config/config')[env];

var app = express();

var ex  = require('./app/config/express')(app,config);

require('./app/routes/routes')(app);

require('./app/models/pastes').initiateTimedKill();

app.listen(config.port);
console.log('Listening on port ' + config.port);
