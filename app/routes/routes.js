var index = require('./index');

module.exports = function(app) {
    app.get('/partials/*', index.partials);
    app.post('/create',  index.create);
    app.get('/index.html', index.index);
    app.get('/paste/:id', index.getpastesub);
    app.get('/:id', index.getpaste);
    app.get('*', index.default);
};
