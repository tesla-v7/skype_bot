'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('logs', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
          },
          user_id: {
              type: Sequelize.TEXT('tiny')
          },
          user_name: {
              type: Sequelize.TEXT('tiny')
          },
          text: {
              type: Sequelize.TEXT
          },
          state: {
              type: Sequelize.INTEGER(1)
          },
          valid: {
              type: Sequelize.INTEGER(1)
          },
          timestamp_msg: {
              type: Sequelize.DATE
          },
          timestamp_usr: {
              type: Sequelize.DATE
          },
      });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('logs');
  }
};
