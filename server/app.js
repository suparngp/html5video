var express = require('express');
var winston = require('winston');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var init = require('./preprocess/init');
var config = require('./preprocess/config');

var routes = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var session = require('./routes/session');
var pair = require('./routes/pair');

var app = express();

var sessionCtrl = require('./controllers/sessionCtrl');
var redirectCtrl = require('./controllers/redirectCtrl');
var errorCtrl = require('./controllers/errorCtrl');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var env = process.env.NODE_ENV || 'development';
var promise = init.loadDBConnection(env);

app.initServer = function () {
    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser(config.cryptoConfig.cookies.secret));
    app.use(require('less-middleware')(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));

    app.all('/*', function(req, res, next){
        req.tv = {};
        next();
    });
    app.use('/', routes);
    app.use('/users', users);
    app.use('/signup', signup);
    app.use('/session', session);
    app.use('/pair/device', pair)
    //all the routes which require session verification go after this
    app.all('/*', sessionCtrl.verifySession);

    app.get('/dashboard', function(req, res, next){
        res.json(200, {note: 'dashboard rendered'});
    });

    app.use('/pair/code', pair);

    //error handlers
    app.use(errorCtrl.handle404);
    app.use(errorCtrl.handleErrResponse);

    /// catch 404 and forward to error handler
//    app.use(function (req, res, next) {
//        var err = new Error('Not Found');
//        err.status = 404;
//        next(err);
//    });
//
//    /// error handlers
//
//    // development error handler
//    // will print stacktrace
//    if (app.get('env') === 'development') {
//        app.use(function (err, req, res, next) {
//            res.status(err.status || 500);
//            res.render('error', {
//                message: err.message,
//                error: err
//            });
//        });
//    }
//
//    // production error handler
//    // no stacktraces leaked to user
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: {}
//        });
//    });

    app.listen(3000, function(){
        console.log('server running at 3000');
    });
};

promise
    .then(app.initServer)
    .catch(function (err) {
        winston.error(err);
        winston.error('Unable to start the server');
    });

module.exports = app;