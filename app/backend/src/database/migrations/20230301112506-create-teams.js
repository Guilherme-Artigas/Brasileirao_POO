'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'teams',
      {
        id: {
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        teamName: {
          allowNull: false,
          type: Sequelize.STRING,
          field: 'team_name',
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('teams');
  },
};
