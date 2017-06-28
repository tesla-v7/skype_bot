'use strict';

module.exports = {
    routes: {},
    parceRoute: function (data) {
        let idNameBod = data.entities[0].text || '';
        idNameBod = idNameBod.match(/<at .*>(.*)<\/at>/);
        idNameBod = idNameBod ? idNameBod[1] : '';
        return data.text.replace(idNameBod, '').split(' ')[0].toLowerCase().trim()
    },
    go: function (data) {
        let str = this.parceRoute(data);
        console.log('parce ', str);
        if(this.routes[str]){
            console.log('run', str);
            return this.routes[str](data);
        }
        if(this.routes['default']){
            console.log('run default');
            return this.routes['default'](data);
        }
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