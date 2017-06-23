'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    id: DataTypes.INEGER,
    user_id: DataTypes.TEXT,
    user_name: DataTypes.TEXT,
    user_doc_name: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};