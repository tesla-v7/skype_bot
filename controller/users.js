'use strict';
var models = require('../models/index');

module.exports = {
    saveUser: function (data) {
        let name = data.text.replace(/\s{2,}/g, ' ').split(/\s/).slice(2).join(' ');
        console.log('-', name);
        if(name.length < 3){
            return `Пользователь ${data.user.name} слишком короткое имя '${name}'`;
        }
        return models.Users.findOrCreate({
            where: {
                user_id: data.user.id
            },
            defaults: {
                user_name: data.user.name,
                user_doc_name: name,
            }
        }).spread((user, created) => {
            if(!created){
                user.user_doc_name = name;
                return user.save();
            }
            return;
        })
        .then(() =>{
            return `Пользователь ${data.user.name} сопоставлне с именем '${name}'`;
        })
        .catch((e) => {
            return `Ошибка сохранения имени для ${data.user.name}`;
        });
    }
};