'use strict';

module.exports = {
    routes: {},
    parceRoute: function (data) {
        let idNameBod = '';
        if(data.entities.length){
            idNameBod = data.entities[0].text || '';
        }
        idNameBod = idNameBod.match(/<at .*>(.*)<\/at>/);
        idNameBod = idNameBod ? idNameBod[1] : '';
        return data.text.replace(idNameBod, '').toLowerCase().trim().split(' ');
    },
    go: function (skypeData) {
        let command = this.parceRoute(skypeData);
        let run = command[0] || 'default';
        console.log('parce ', command, run);
        if(this.routes[run]){
            console.log('run', command);
            return this.routes[run](command, skypeData);
        }
        return this.routes['default'](command, skypeData);
    },
    add: function (patern, callback) {
        let the = this;
        if(Array.isArray(patern)){
            patern.map(function (val) {
                the.routes[val] = callback;
                return val;
            });
            return;
        }
        this.routes[patern] = callback;
        return;
    }
};