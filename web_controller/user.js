/**
 * Created by gilani on 29.06.17.
 */
var models = require("../models/index");

module.exports = {
    user_view:function (req, res, next) {
        models.Users.findAll().
            then(function (users) {
                console.log(users);
            res.render('users', {
                title: "Таблица отроботанных дней",
                users: users
            });
        })
    }
};