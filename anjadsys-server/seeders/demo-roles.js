'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [{
      name: 'admin'
     },
     {
      name: 'agent'
     },
     {
      name: 'customer'
     },
     {
      name: 'supplier'
     },
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
