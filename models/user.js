'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    user_id: DataTypes.TEXT('tiny'),
    user_name: DataTypes.TEXT('tiny'),
    user_doc_name: DataTypes.TEXT('tiny')
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};