'use strict';
module.exports = function(sequelize, DataTypes) {
  var task = sequelize.define('task', {
    task_id: {
      type: DataTypes.CHAR(10),
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    data: DataTypes.TEXT,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return task;
};