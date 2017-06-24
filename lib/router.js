'use strict';

module.exports = {
    routes: {},
    go: function (str, data) {
        console.log(this.routes);
        console.log(str, this.routes[str]);
        if(this.routes[str]){
            console.log('run');
            return this.routes[str](data);
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