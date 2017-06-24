'use strict';
var models = require('../models/index');
var parser = require('../lib/parser');
var moment    = require('moment');

module.exports = {
    saveLog: function(skypeData){
        var parseData = parser.parseParams(skypeData);
        var saveData = {
            text: skypeData.text || '',
            user_name: skypeData.user.name || '',
            user_id: skypeData.user.id || '',
            timestamp_msg: skypeData.timestamp,
            timestamp_usr: parseData.time || skypeData.timestamp,
            state: parseData.evetn
        };
        let deyTmp = moment(saveData.timestamp_usr).format("YYYY.MM.DD ");
        var dataDey = [deyTmp + "00:00:00",  deyTmp + "23:59:59"];
        if(parseData.time == 'unknown' || parseData == 'unknown'){
            return {
                error: true,
                msg: 'нераспознаная комманда',
                saveData: saveData
            };
        }
        models.logs.create(saveData).
        then(function (logItem) {
            return models.logs.findAll({
                order: [['id', 'DESC']],
                limit: 2,
                where:{
                    user_id: logItem.user_id,
                    timestamp_usr:{
                        $between: dataDey
                    }
                }
            });
        }).
        then(function (logs) {
            if(logs.length > 1 && logs[0].state == logs[1].state){
                logs[1].valid = 0;
                logs[1].save();
            }
        }).catch(function (e) {
            console.log(e);
        });
        return {
            error: false,
            saveData: saveData,
            time: moment(saveData.timestamp_usr).format("YYYY.MM.DD HH:mm")
        }
    }

};