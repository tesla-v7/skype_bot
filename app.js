var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config/config.json')[env || 'development'];
var restify   = require('restify');
var builder   = require('botbuilder');
var saveData  = require('./lib/saveData');

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

var bot = new builder.UniversalBot(connector, function (session) {
    console.log(session);
    var result = saveData.saveLog(session.message);
    console.log(result);
    if(result.error){
        session.send('Пользователь %s: %s', result.saveData.user_name, result.msg);
    }else{
        session.send('Пользователь %s собитие %s в %s ', result.saveData.user_name, result.saveData.state, result.time);
    }
});