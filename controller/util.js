'use strict';

module.exports = {
    help: function (command, skypeData) {
        let text = [
            '- help - список комманд\r\n -\r\n',
            '- (in | пришел) - время прихода можно указвать без даты берется текущее время' +
            'также можно указать время in 10[:,]15 дата берется текущая' +
            "также можно указать дату полностью in 2017[.-]06[.-]24  10[:,]15n\r\n" +
            "Примеры:\r\n" +
            "in\r\n" +
            "in 8:45\r\n" +
            "in 2017.06.25 8:45\r\n -\r\n",
            '- (out | ушел) - время ухода праметры аналогичны комманде (in | пришел)\r\n -\r\n',
            '- (i | я)[delete || удалить]  - связать вашь skype ID с вашим именем в табеле или удалить\r\n' +
            'Пример:\r\n'+
            'i Иван Иванычь\r\n',
            'i delete\r\n -\r\n',
            // '- sync - заполнить табель',
            '- ping -  проверка связи с ботом',
        ];
        return text.join("");
    },
    ping: function (command, skypeData) {
        return `${skypeData.user.name} pong`;
    },
    default: function (command, skypeData) {
        return `${skypeData.user.name} воспользуйтесь коммандой help`;

    }
};