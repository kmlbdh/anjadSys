'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      id: 'AD-001',
      identityNum: 851416180,
      username: 'Obada',
      // file deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
      password: bcrypt.hashSync('12345'),
      address: 'مخيم الفوار',
      jawwal1: 569137015,
      email: 'kmlbdh@hotmail.com',
      roleId: 1,
      regionId: 2,
      createdAt: new Date('2022-01-29'),
      updatedAt: new Date('2022-01-29')
     }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
