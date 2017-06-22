'use strict';
var models = require('../models');
var parser = require('./parser');
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
        if(parseData.time == 'unknown' || parseData == 'unknown'){
            return {
                error: true,
                msg: 'нераспознаная комманда',
                saveData: saveData
            };
        }
        models.logs.create(saveData).
        then(function (logItem) {
            return models.logs.findById(logItem.id -1);
        });
        return {
            error: false,
            saveData: saveData,
            time: moment(saveData.timestamp_usr).format("YYYY.MM.DD HH:mm")
        }
    }

};