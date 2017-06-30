var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config/config.json')[env || 'development'];
var restify   = require('restify');
var builder   = require('botbuilder');

var router    = require('./lib/router');
var loger     = require('./controller/loger');
var users     = require('./controller/users');
var help      = require('./controller/help');
var sync      = require('./controller/syncGoogleSheet');
var task      = require('./controller/task');
// var googleDoc = require('./lib/googleDoc');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: config['auth']['skype']['appId'],
    appPassword: config['auth']['skype']['appPassword']
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// googleDoc.setAuth(config.auth.google);
sync.setAuth(config.auth.google);
sync.setSheetParams(config.google_sheet);
// sync.setSheetParams('test');

router.add(['in', 'out', 'пришел', 'ушел'], loger.saveLog);
router.add('ping', help.ping);
router.add('help', help.help);
router.add('default', help.default);
router.add('sync', sync.syncAll.bind(sync));
router.add(['i', 'я'], users.saveUser);
// router.add('test', task.createTask.bind(task));
router.add('test', task.sevaTaskGooglDoc.bind(task));

var bot = new builder.UniversalBot(connector, function (session) {
    // session.sendTyping();
    // console.log(session);
    console.log(session.message);
    Promise.resolve(router.go(session.message)).
    then((resylt) => {
        // if(Array.isArray(resylt)){
        //     resylt.map(function (item) {
        //         session.send(item);
        //     })        //     return;
        // }
        session.send(resylt);
    }).
    catch((error) => {
        session.send('Возникла ошибка');
    });
});

var express = require('express');
var app = express();



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})

var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
