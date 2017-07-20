var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config/config.json')[env || 'development'];
var restify   = require('restify');
var builder   = require('botbuilder');

var moment    = require('moment');
var schedule  = require('node-schedule');

var router    = require('./lib/router');
var loger     = require('./controller/loger');
var users     = require('./controller/users');
var util      = require('./controller/util');
var task      = require('./controller/task');

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

moment.tz(config.timezone);

task.setAuth(config.auth.google);
task.setSheetParams(config.google_sheet);
loger.setTimeZone(config.timezone);

let msg = new builder.Message().address(config.skype.address);

router.add(['in', 'out', 'пришел', 'ушел'], function (command, skypeData) {
    let saveLog = loger.saveLog.bind(loger);
    let chatId = config.skype.address.conversation.id;
    let senderId = skypeData.address.conversation.id;
    return Promise.resolve(saveLog(command, skypeData)).
    then((text) =>{
        if(chatId != senderId){
            msg.text(`${skypeData.user.name} ${moment(skypeData.timestamp).format("YYYY.MM.DD HH:mm")} \r\n\r\n ${skypeData.text}`);
            // msg.textLocale('en-US');
            bot.send(msg);
        }
        return text;
    });
});
router.add('ping', util.ping);
router.add('help', util.help);
router.add('default', util.default);
router.add(['i', 'я'], users.run.bind(users));

let scheduleGoogle = schedule.scheduleJob(config.cron, function () {
    let createTask = task.createTask.bind(task);
    let saveTaskInGooglDoc = task.saveTaskInGooglDoc.bind(task);
    Promise.resolve(createTask()).
    then(() =>{
        saveTaskInGooglDoc();
    });
});

var bot = new builder.UniversalBot(connector, function (session) {
    console.log(session.message);
    console.log(JSON.stringify(session.message.address));
    Promise.resolve(router.go(session.message)).
    then((resylt) => {
        session.send(resylt);
    }).
    catch((error) => {
        console.log(error);
        session.send('Возникла ошибка');
    });
});
