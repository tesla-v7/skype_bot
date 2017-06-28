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
        //     });
        //     return;
        // }
        session.send(resylt);
    }).
    catch((error) => {
        session.send('Возникла ошибка');
    });
});
