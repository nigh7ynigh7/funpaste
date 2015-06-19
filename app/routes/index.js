var pastesCont = require('../controllers/pastes');
var config = require('../config/config')[process.env.NODE_ENV];

module.exports.partials = function(req,res){
    res.render('../../public/app/'+req.params[0]);
};

module.exports.create = function(req,res){
    pastesCont.createPastes(req.body).then(function(result){
        return res.send({
            success:true,
            paste:result,
            siteURL:config.siteUrl});
    }, function(error){
        return res.send({ success : false });
    });
};

module.exports.index = function(req,res){
    res.render('index', {
        pageTitle:'PasteBin'
    });
};

module.exports.getpastesub = function(req,res){
    console.log(req.params.id);
    pastesCont.getPaste(req.params.id).then(function(result){
        return res.send({
            success:true,
            paste:result
        });
    }, function(error){
        return res.send({
            success:false
        });
    });
};

module.exports.getpaste = function(req,res){
    pastesCont.getPaste(req.params.id).then(function(result){
        return res.render('pasted',
            {
                pageTitle: 'Paste ' + result._id,
                pasteId : req.params.id,
                siteURL : config.siteUrl
            }
        );
    },
    function(error){
        return res.redirect('/index.html');
    });
};

module.exports.default = function(req, res){
    res.redirect('index.html');
};
