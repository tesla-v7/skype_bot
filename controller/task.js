'use strict';
let models      = require('../models/index');
const crypto    = require('crypto');
let moment      = require('moment-timezone');
let googleDoc   = require('../lib/googleDoc');

let Months = [
    'Январь',
    'Феврать',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

let setToHouse = 3600000;
let houseWorkDay = 8;
let zeroLine = [];

module.exports = {
    sheetParams: null,
    setTimeZone: function (timeZone) {
        moment.tz.setDefault(timeZone);
    },
    setAuth: function (auth) {
        googleDoc.setAuth(auth);
    },
    setSheetParams: function (param) {
        this.sheetParams = param;
    },
    add: function () {
        let data = moment().format("YYYY-MM-DD");
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
        }).catch(function (e) {
        });
        let sqlReqest = `SELECT log_Out.user_id, Users.user_doc_name, timestamp_usr AS Time_OUT, 
(SELECT timestamp_usr FROM logs 
WHERE user_id = log_Out.user_id AND timestamp_usr < log_Out.timestamp_usr AND state=1 AND valid=1 
ORDER BY timestamp_usr DESC LIMIT 1) 
AS Time_In FROM logs AS log_Out, Users WHERE log_Out.user_id = Users.user_id  AND state=-1 
AND valid=1 AND timestamp_usr BETWEEN '${data} 00:00:00' And '${data} 23:59:59' ORDER BY timestamp_usr DESC`;
    },
    createTask: function () {
        let the = this;
        let data = moment().format("YYYY-MM-DD");
        // let data = "2017-07-18";
        let task = {
            task_id: data,
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
            // return models.task.create(task);
            return models.task.findOrCreate({
                where:{
                    task_id: task.task_id
                },
                defaults: task
            }).spread((task, created) =>{
                return task;
            });
        }).
        then(function (taskSave) {
            console.log(taskSave);
            return 'Save';
        });
    },
    saveTaskInGooglDoc: function () {
        for(let i =0; i < 31; i++){
            zeroLine.push('');
        }
        console.log('saveTaskInGooglDoc/**********************');
        let promiseSheets = [];
        let sheetsData = {};
        let the = this;
        return models.task.findAll({
            where:{
                status: 0
            }
        }).
        then(function (tasks) {
            if(tasks.length > 0){
                tasks.map(function (task) {
                    let sheetName = Months[moment(task.task_id).get('month')];
                    if(!sheetsData[`'${sheetName}'`]){
                        sheetsData[`'${sheetName}'`] = { tasks: [task], googleDoc: null, status: false, sendValue: []};
                        promiseSheets.push(googleDoc.get(the.sheetParams.spreadsheetId, `'${sheetName}'!${the.sheetParams.range}`));
                        return;
                    }
                    sheetsData[`'${sheetName}'`].tasks.push(task);
                });
                return Promise.all(promiseSheets);
            }
            return null;
        }).
        then((data) => {
            console.log(data);
            if(data != null){
                data.map((item) => {
                    if(item == null){
                        return;
                    }
                    sheetsData[item.range.split('!')[0]].googleDoc = item;
                });
                let sheetsKeys = Object.keys(sheetsData);
                sheetsKeys.map((month) => {
                    if(sheetsData[month].googleDoc == null){
                        return;
                    }
                    sheetsData[month].tasks.map((task) => {
                        let day = moment(task.task_id).get('date');
                        task.data = JSON.parse(task.data);
                        let names = Object.keys(task.data);
                        names.map((name) =>{
                            sheetsData[month].googleDoc.values.map((line, index) => {
                                console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                                console.log(line);
                                // line[line.length -1] = '';
                                // console.log(name.toLowerCase(), line[0].toLowerCase(), name.toLowerCase() == line[0].toLowerCase());
                                if(line[0] && name.toLowerCase() == line[0].toLowerCase()){
                                    if(line[day] == undefined || line[day] == ''){
                                        if(line.length < day){
                                            console.log(the.zeroArray(day - line.length));
                                            sheetsData[month].googleDoc.values[index] = line = line.concat(the.zeroArray(day - line.length));
                                        }
                                        // line[day] = (task.data[name] / houseWorkDay).toFixed(2).replace('.', ',');
                                        line[day] = (task.data[name] / houseWorkDay).toFixed(2) -0;
                                    }
                                }
                            });
                        });
                    });
                });
                return sheetsData;
            }
            console.log('Not tasks');
            return null;
        }).
        then((data) => {
            let promiseSheetsSave = [];
            if(data != null){
                console.log('===========================SAVE DATA');
                let names = Object.keys(data);
                names.map((item) => {
                    if(data[item].googleDoc == null){
                        return;
                    }
                    promiseSheetsSave.push(new Promise((resolve, reject) => {
                        console.log(data[item].googleDoc.values[5]);
                        googleDoc.save(the.sheetParams.spreadsheetId, `${item}!${the.sheetParams.range}`, data[item].googleDoc.values).
                        then((response) => {
                            console.log('Save Ok');
                            console.log(response);
                            data[item].status = true;
                            resolve(true);
                        });
                    }));
                });
                return Promise.all(promiseSheetsSave);
            }
            return null;
        }).
        then((data) => {
            let names = Object.keys(sheetsData);
            let saveTasks = [];
            names.map((item)=>{
                if(!sheetsData[item].status){
                    return;
                }
                sheetsData[item].tasks.map((task)=>{
                    task.update({status: 1});
                });
            });
            return;
        });
        return;
    },
    parseData: function (data) {
        return data.reduce(function (result, item) {
            if(!result[item.user_doc_name]){
                result[item.user_doc_name] = 0;
            }
            result[item.user_doc_name] += moment(item.Time_OUT).diff(moment(item.Time_In)) /setToHouse;
            return result;
        }, {});
        
    },
    zeroArray: function (len) {
        return Array(len +1).join(' ').split(' ');
    }
};