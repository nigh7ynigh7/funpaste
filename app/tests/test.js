var env = process.env.NODE_ENV = process.env.NODE_ENV || 'test';


//test the paste models
require('./models/pasteTests')();
require('./config/config')();
