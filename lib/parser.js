'use strict';
var moment    = require('moment');

var paternEvent = {
    in: [/пришел/i, /in/i],
    out: [/ушел/i, /out/i]
};

var paternTime = [
  /\d{4,4}[\.\,\s\-]\d{2,2}[\.\,\s\-]\d{2,2}/i,
  /\d{1,2}[\.\,\s\:]\d{2,2}/i
];
var splitsAll = /[\.\,\s\:]/;
const TimeSplit = ':';
const DataSplit = '.';

function parsEvent(str) {
    var typeAction = paternEvent.in.reduce(function (state, item) {
        if(str.text.search(item) > -1){
            return state +1;
        }
        return state;

    }, 0);

    typeAction = paternEvent.out.reduce(function (state, item) {
        if(str.text.search(item) > -1){
            return state -1;
        }
        return state;
    }, typeAction);

    if(typeAction > 0){
        return 'in';
    }

    if(typeAction < 0){
        return 'out';
    }
    return 'unknown';
}

function splitReplace(str) {
    return str.length > 5 ? str.replace(splitsAll, DataSplit) : str.replace(splitsAll, TimeSplit);

}

function dataFormatParce(str) {
    return str.length > 5 ? "YYYY.MM.DD HH:mm" : "HH:mm"
}

function parsTime(str) {
    var time = paternTime.reduce(function (state, item) {
        var bufTime = str.text.match(item);
        if(bufTime && bufTime.index > -1){
            return state.concat(' ', splitReplace(bufTime['0']));
        }
        return state;
    }, '');
    time = time.trim();
    console.log('time RAW |',time,'|');
    if(time != ''){
        time = moment(time.replace(splitsAll, TimeSplit), dataFormatParce(time));
        console.log(time.format());
        return time.isValid() ? time.format() : 'unknown';
    }
    return null;
}

module.exports = {
        parseParams : function (str) {
            return {
                evetn: parsEvent(str),
                time : parsTime(str)
            };
        }
};