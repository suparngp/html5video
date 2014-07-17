var express = require('express');
var winston = require('winston');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var init = require('./preprocess/init');
var routes = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var config = require('./preprocess/config');
var app = express();

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

    app.use('/', routes);
    app.use('/users', users);
    app.use('/signup', signup);
    /// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
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