var env = process.env.NODE_ENV = process.env.NODE_ENV || 'test';


//test the paste models
require('./config/config')();


//tests the models
require('./models/pasteTests')();

//test the controllers
require('./controllers/pastes')();
