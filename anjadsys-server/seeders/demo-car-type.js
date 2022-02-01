'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CarTypes', [
      {
        name: 'Dodge'
      },
      {
        name: 'Jeep'
      },
      {
        name: 'أفيكو'
      },
      {
        name: 'الفا روميو'
      },
      {
        name: 'اوبل'
      },
      {
        name: 'اودي'
      },
      {
        name: 'ايسوزو'
      },
      {
        name: 'باص'
      },
      {
        name: 'بي ام دبليو'
      },
      {
        name: 'بيجو'
      },
      {
        name: 'تويوتا'
      },
      {
        name: 'جاجوار'
      },
      {
        name: 'جي ام سي'
      },
      {
        name: 'داتشيا'
      },
      {
        name: 'داف'
      },
      {
        name: 'دايو'
      },
      {
        name: 'دراجة نارية'
      },
      {
        name: 'ديهاتسو'
      },
      {
        name: 'روفر'
      },
      {
        name: 'رينو'
      },
      {
        name: 'سانغ يونغ'
      },
      {
        name: 'ستروين'
      },
      {
        name: 'سكودا'
      },
      {
        name: 'سوبارو'
      },
      {
        name: 'سوزوكي'
      },
      {
        name: 'سيت'
      },
      {
        name: 'شاحنة'
      },
      {
        name: 'شفروليه'
      },
      {
        name: 'فورد'
      },
      {
        name: 'فولفو'
      },
      {
        name: 'فولكسفاجن'
      },
      {
        name: 'فيات'
      },
      {
        name: 'كاديلاك'
      },
      {
        name: 'كرايسلر'
      },
      {
        name: 'كيا'
      },
      {
        name: 'لاندروفر'
      },
      {
        name: 'مازدا'
      },
      {
        name: 'مرسيدس'
      },
      {
        name: 'ميتسوبيشي'
      },
      {
        name: 'نيسان'
      },
      {
        name: 'هوندا'
      },
      {
        name: 'هونداي'
      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CarTypes', null, {});
  }
};
