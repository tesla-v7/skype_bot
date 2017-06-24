var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config/config.json')[env || 'development'];
var restify   = require('restify');
var builder   = require('botbuilder');

var router    = require('./lib/router');
var loger  = require('./controller/loger');
var users      = require('./controller/users');
var help      = require('./controller/help');
var googleDoc = require('./lib/googleDoc');

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

googleDoc.setAuth(config.auth.google);

router.add(['in', 'out', 'пришел', 'ушел'], loger.saveLog);
router.add('echo', help.echo);
router.add('help', help.help);

var bot = new builder.UniversalBot(connector, function (session) {
    let command = session.message.text.split(' ')[0].toLowerCase();
    session.send(router.go(command || '', session.message));
});