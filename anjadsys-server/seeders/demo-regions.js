'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Regions', [
      {
        name: 'اريحا'
      },
      {
        name: 'الخليل'
      },
      {
        name: 'القدس'
      },
      {
        name: 'بيت لحم'
      },
      {
        name: 'جنين'
      },
      {
        name: 'رام الله والبيرة'
      },
      {
        name: 'سلفيت'
      },
      {
        name: 'طوباس'
      },
      {
        name: 'طولكرم'
      },
      {
        name: 'قلقيلية'
      },
      {
        name: 'نابلس'
      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Regions', null, {});
  }
};
