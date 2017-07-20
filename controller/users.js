'use strict';
var models = require('../models/index');

module.exports = {
    saveUser: function (command, skypeData) {
        let name = command.slice(1).join(' ');
        console.log('-', name);
        if(name.length < 3){
            return `Пользователь ${skypeData.user.name} слишком короткое имя '${name}'`;
        }
        return models.Users.findOrCreate({
            where: {
                user_id: skypeData.user.id
            },
            defaults: {
                user_name: skypeData.user.name,
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
            return `Пользователь ${skypeData.user.name} сопоставлне с именем '${name}'`;
        })
        .catch((e) => {
            return `Ошибка сохранения имени для ${skypeData.user.name}`;
        });
    },
    getUserName: function (skypeData) {
        return models.Users.findOne({
            where:{
                user_id: skypeData.user.id
            }
        })
        .then(function (user) {
            return user ? user.user_doc_name : 'Вашие имя не сопоставленно';
        })
        .catch((e)=>{
            return 'Что то пошло не так...' +
            '';
        });
    },
    deleteUser: function (command, skypeData) {
        return models.Users.findOne({
            where:{
                user_id: skypeData.user.id
            }
        }).
        then(function (user) {
            return user ? user.destroy() : '';
        }).
        then(function () {
            return `${skypeData.user.name} вы успешно удалены`;
        });
    },
    run: function (command, skypeData) {
        console.log('run == ', command.slice(1).join(' '));
        if(command.length == 1){
            return this.getUserName(skypeData);
        }
        if(command[1] == 'delete' || command[1] == 'удалить'){
            return this.deleteUser(command, skypeData);
        }
        return this.saveUser(command, skypeData);
    }
};