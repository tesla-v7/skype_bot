'use strict';
let models      = require('../models/index');
const crypto    = require('crypto');
let moment      = require('moment');

module.exports = {
    add: function () {
        let data = moment().format("YYYY-MM-DD");
        // let task_id =
        let task = {
            task_id: crypto.createHmac('sha256', data).digest('hex'),
            data: 'test'
        };
        models.task.find({
            where:{
                task_id: task.task_id
            }
        }).
        then(function (task) {
            this.createTask();
            console.log('task -->', task);
        }).catch(function (e) {
            console.log('e--->',e);
        });
        let sqlReqest = `SELECT log_Out.user_id, Users.user_doc_name, timestamp_usr AS Time_OUT, 
(SELECT timestamp_usr FROM logs 
WHERE user_id = log_Out.user_id AND timestamp_usr < log_Out.timestamp_usr AND state=1 AND valid=1 
ORDER BY timestamp_usr DESC LIMIT 1) 
AS Time_In FROM logs AS log_Out, Users WHERE log_Out.user_id = Users.user_id  AND state=-1 
AND valid=1 AND timestamp_usr BETWEEN '${data} 00:00:00' And '${data} 23:59:59' ORDER BY timestamp_usr DESC`;
        console.log('hash --> ', task);
        console.log('hash.len --> ', task.task_id.length);
    },
    createTask: function () {
        let the = this;
        let data = moment().format("YYYY-MM-DD");
        // data = "2017-06-26";
        // let task_id =
        let task = {
            task_id: data,
            // task_id: crypto.createHmac('sha256', data).digest('hex'),
            data: ''
        };
        let sqlReqest = `SELECT log_Out.user_id, Users.user_doc_name, timestamp_usr AS Time_OUT, 
(SELECT timestamp_usr FROM logs 
WHERE user_id = log_Out.user_id AND timestamp_usr < log_Out.timestamp_usr AND state=1 AND valid=1 
ORDER BY timestamp_usr DESC LIMIT 1) 
AS Time_In FROM logs AS log_Out, Users WHERE log_Out.user_id = Users.user_id  AND state=-1 
AND valid=1 AND timestamp_usr BETWEEN '${data} 00:00:00' And '${data} 23:59:59' ORDER BY timestamp_usr DESC`;
        return models.sequelize.query(sqlReqest, { type: models.sequelize.QueryTypes.SELECT}).
        then(function (timimgData) {
            let workTime = the.parseData(timimgData);
            console.log(workTime);
            task.data = JSON.stringify(workTime);
            return models.task.create(task);
        }).
        then(function (taskSave) {
            console.log(taskSave);
            return 'Save';
        });
    },
    sevaTaskGooglDoc: function () {
        models.task.findAll({
            while:{
                status: 0
            }
        }).
        then(function (tasks) {
            console.log(tasks.length);
            console.log(tasks[0]);
            console.log(tasks[2]);
        });
    },
    parseData: function (data) {
        return data.reduce(function (result, item) {
            if(!result[item.user_doc_name]){
                result[item.user_doc_name] = 0;
            }
            result[item.user_doc_name] += moment(item.Time_OUT).diff(moment(item.Time_In)) /3600000;
            return result;
        }, {});
        
    }
};