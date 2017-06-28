'use strict';
let googleDoc = require('../lib/googleDoc');
let models = require('../models/index');
let moment      = require('moment');

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

module.exports = {
    sheetParams: null,
    setAuth: function (auth) {
        googleDoc.setAuth(auth);
    },
    setSheetParams: function (param) {
        this.sheetParams = param;
    },
    sync: function () {

    },
    syncAll: function () {
        let month = Months[new Date().getMonth()];
        googleDoc.get(this.sheetParams.spreadsheetId, `'${month}'!${this.sheetParams.range}`).
        then((data)=>{
            console.log('promice -->', data);
        }).catch((err)=>{
            console.log('promice ERR -->', err);
        });

    }
};