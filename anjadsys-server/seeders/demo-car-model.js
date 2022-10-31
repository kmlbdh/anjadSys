'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CarModels', [
      { name: 'رام', carTypeId: 1 }, 
      { name: 'نيترو', carTypeId: 1 },

      { name: 'Renegade', carTypeId: 2 },
      { name: 'sofa', carTypeId: 2 },
      { name: 'Wrangler', carTypeId: 2 },
      { name: 'روبيكون', carTypeId: 2 },
      { name: 'شيروكي', carTypeId: 2 },
      { name: 'كومباس',carTypeId: 2 },

      { name: '50C13', carTypeId: 3 }, 
      { name: '65C18', carTypeId: 3 }, 
      { name: 'ديلي', carTypeId: 3 },

      { name: 'بويك', carTypeId: 4 }, 
      { name: 'جوليتا', carTypeId: 4 },

      { name: 'أوميغا', carTypeId: 5 }, 
      { name: 'إنسيجنيا', carTypeId: 5 },
      { name: 'استرا', carTypeId: 5 },
      { name: 'اسكونا', carTypeId: 5 }, 
      { name: 'ريكورد', carTypeId: 5 },
      { name: 'زافيرا', carTypeId: 5 },
      { name: 'فيكترا', carTypeId: 5 }, 
      { name: 'كاديت', carTypeId: 5 },
      { name: 'كورسا', carTypeId: 5 },
      { name: 'موكا', carTypeId: 5 },

      { name: 'SLine', carTypeId: 6 }, 
      { name: '80', carTypeId: 6 },
      { name: 'A3', carTypeId: 6 },
      { name: 'A4', carTypeId: 6 }, 
      { name: 'A6', carTypeId: 6 },
      { name: 'A8', carTypeId: 6 },
      { name: 'A80', carTypeId: 6 }, 
      { name: 'Q3', carTypeId: 6 },
      { name: 'Q5', carTypeId: 6 },
      { name: 'Q7', carTypeId: 6 },
      { name: 'TT كوبيه', carTypeId: 6 },

      { name: '3900', carTypeId: 7 },
      { name: 'تروبر', carTypeId: 7 },
      { name: 'ديماكس', carTypeId: 7 },

      { name: '316', carTypeId: 9 },
      { name: '318', carTypeId: 9 }, 
      { name: '320', carTypeId: 9 },
      { name: '325', carTypeId: 9 },
      { name: '328 i', carTypeId: 9 },
      { name: '435', carTypeId: 9 }, 
      { name: '520', carTypeId: 9 },
      { name: '523', carTypeId: 9 },
      { name: '525', carTypeId: 9 }, 
      { name: '528', carTypeId: 9 },
      { name: '530', carTypeId: 9 },
      { name: '535', carTypeId: 9 }, 
      { name: '730', carTypeId: 9 },
      { name: '740', carTypeId: 9 },
      { name: 'i 116', carTypeId: 9 },
      { name: 'i120', carTypeId: 9 },  
      { name: 'M3', carTypeId: 9 }, 
      { name: 'M4', carTypeId: 9 },
      { name: 'x1', carTypeId: 9 },
      { name: 'x2', carTypeId: 9 },
      { name: 'x3', carTypeId: 9 },
      { name: 'x4', carTypeId: 9 },
      { name: 'x5', carTypeId: 9 },
      { name: 'x6', carTypeId: 9 },
      { name: 'x7', carTypeId: 9 },
      { name: 'ميني كوبر', carTypeId: 9 }, 

      { name: '104', carTypeId: 10 },
      { name: '106', carTypeId: 10 }, 
      { name: '107', carTypeId: 10 },
      { name: '2008', carTypeId: 10 },
      { name: '204', carTypeId: 10 },
      { name: '205', carTypeId: 10 }, 
      { name: '206', carTypeId: 10 },
      { name: '206+', carTypeId: 10 },
      { name: '207', carTypeId: 10 }, 
      { name: '208', carTypeId: 10 },
      { name: '3008', carTypeId: 10 },
      { name: '301', carTypeId: 10 },
      { name: '305', carTypeId: 10 },
      { name: '306', carTypeId: 10 },
      { name: '307', carTypeId: 10 },
      { name: '308', carTypeId: 10 },  
      { name: '308 GT', carTypeId: 10 }, 
      { name: '308 GTi', carTypeId: 10 },
      { name: '309', carTypeId: 10 },
      { name: '405', carTypeId: 10 },
      { name: '406', carTypeId: 10 },
      { name: '407', carTypeId: 10 },
      { name: '5008', carTypeId: 10 },
      { name: '504', carTypeId: 10 },
      { name: '505', carTypeId: 10 },
      { name: '508', carTypeId: 10 },
      { name: '605', carTypeId: 10 },
      { name: '607', carTypeId: 10 },
      { name: 'اكسبرت', carTypeId: 10 },
      { name: 'بارتنر', carTypeId: 10 },
      { name: 'بوكسر', carTypeId: 10 },
      { name: 'ريفتر', carTypeId: 10 },

      { name: 'FT-86', carTypeId: 11 },
      { name: 'أفالون', carTypeId: 11 },  
      { name: 'افانزا', carTypeId: 11 }, 
      { name: 'افينسيس', carTypeId: 11 },
      { name: 'اورايون', carTypeId: 11 },
      { name: 'باريس', carTypeId: 11 },
      { name: 'برادو', carTypeId: 11 },
      { name: 'برافيا', carTypeId: 11 },
      { name: 'بريوس', carTypeId: 11 },
      { name: 'تيندرا', carTypeId: 11 },
      { name: 'راف', carTypeId: 11  },
      { name: 'زيلاس', carTypeId: 11 },
      { name: 'سيكويا', carTypeId: 11 },
      { name: 'فورتشينر', carTypeId: 11 },
      { name: 'كامري', carTypeId: 11 },
      { name: 'كورولا', carTypeId: 11 },
      { name: 'لاند كروزر', carTypeId: 11 },
      { name: 'هيلاكس', carTypeId: 11 },

      { name: 'XE', carTypeId: 12 },

      { name: 'سفانا', carTypeId: 13 },
      
      { name: 'داستر', carTypeId: 14 },
      { name: 'دوكر', carTypeId: 14 },
      { name: 'سانديرو', carTypeId: 14 },
      { name: 'ستيب واي', carTypeId: 14 },
      { name: 'لوجان', carTypeId: 14 },
      { name: 'لوجان MCV', carTypeId: 14 },
      { name: 'لودجي', carTypeId: 14 },

      { name: '45', carTypeId: 15 },
      { name: '55', carTypeId: 15 },
      { name: 'CF75', carTypeId: 15 },
      { name: 'CF85', carTypeId: 15  },

      { name: 'رايسر', carTypeId: 16 },
      { name: 'سبيرو', carTypeId: 16 },
      { name: 'سوبر رايسر', carTypeId: 16 },
      { name: 'كوراندو', carTypeId: 16 },
      { name: 'لانوس', carTypeId: 16 },
      { name: 'ليجانزا', carTypeId: 16 },
      { name: 'ماتيز', carTypeId: 16 },
      { name: 'نوبيرا', carTypeId: 16 },

      { name: 'ktm', carTypeId: 17 },

      { name: 'تريوس', carTypeId: 18 },
      { name: 'سيريون', carTypeId: 18 },
      { name: 'ماتيريا', carTypeId: 18 },

      { name: '200', carTypeId: 19 },
      { name: 's400', carTypeId: 19 },

      { name: 'R5', carTypeId: 20 },
      { name: 'R9', carTypeId: 20 },
      { name: 'اكسبرس', carTypeId: 20 },
      { name: 'توينجو', carTypeId: 20 },
      { name: 'سينيك', carTypeId: 20 },
      { name: 'فلوانس', carTypeId: 20 },
      { name: 'كانجو', carTypeId: 20 },
      { name: 'كليو', carTypeId: 20 },
      { name: 'لاجونا', carTypeId: 20 },
      { name: 'ميغان', carTypeId: 20 },

      { name: 'اكتيون', carTypeId: 21 },
      { name: 'ركستون', carTypeId: 21 },
      { name: 'كيرون', carTypeId: 21 },
      { name: 'موسو', carTypeId: 21 },

      { name: 'C4', carTypeId: 22 },
      { name: 'C-Elysee', carTypeId: 22 },
      { name: 'C1', carTypeId: 22 },
      { name: 'C3', carTypeId: 22 },
      { name: 'C3 Aircross', carTypeId: 22 },
      { name: 'C5', carTypeId: 22 },
      { name: 'DS3', carTypeId: 22 },
      { name: 'Spacetourer', carTypeId: 22 },
      { name: 'بيرلينجو', carTypeId: 22 },
      { name: 'بيرلينجو مالتي سبيس', carTypeId: 22 },
      { name: 'بيكاسو C3', carTypeId: 22 },
      { name: 'بيكاسو C4', carTypeId: 22 },
      { name: 'جامبي', carTypeId: 22 },
      { name: 'جراند C4 بيكاسو', carTypeId: 22 },
      { name: 'كسارا', carTypeId: 22 },

      { name: 'citigo', carTypeId: 23 },
      { name: 'اوكتافيا', carTypeId: 23 },
      { name: 'بارمن', carTypeId: 23 },
      { name: 'رابيد', carTypeId: 23 },
      { name: 'رومستر', carTypeId: 23 },
      { name: 'سبيس باك', carTypeId: 23 },
      { name: 'سكالا', carTypeId: 23 },
      { name: 'سوبيرب', carTypeId: 23 },
      { name: 'فابيا', carTypeId: 23 },
      { name: 'فيبوريت', carTypeId: 23 },
      { name: 'فيليسيا', carTypeId: 23 },
      { name: 'كاروك', carTypeId: 23 },
      { name: 'كاميك', carTypeId: 23 },
      { name: 'كسارا', carTypeId: 23 },
      { name: 'كودياك', carTypeId: 23 },
      { name: 'يتي', carTypeId: 23 },

      { name: 'B4', carTypeId: 24 },
      { name: 'امبريزا',  carTypeId: 24 },
      { name: 'عريض', carTypeId: 24 },
      { name: 'فوريستر', carTypeId: 24 },
      { name: 'ليجاسي', carTypeId: 24 },
      { name: 'نملة', carTypeId: 24 },
  
      { name: 'SX4', carTypeId: 25 },
      { name: 'رينو', carTypeId: 25 },
      { name: 'ساموراي', carTypeId: 25 },
      { name: 'سويفت', carTypeId: 25 },
      { name: 'فورينزا', carTypeId: 25 },
      { name: 'فيتارا', carTypeId: 25 },
      { name: 'فيرونا', carTypeId: 25 },

      { name: 'أتيكا', carTypeId: 26 },
      { name: 'ابيزا', carTypeId: 26 },
      { name: 'ارونا', carTypeId: 26 },
      { name: 'انكا', carTypeId: 26 },
      { name: 'توليدو', carTypeId: 26 },
      { name: 'روندا', carTypeId: 26 },
      { name: 'قرطبة', carTypeId: 26 },
      { name: 'ليون', carTypeId: 26 },

      { name: 'داف', carTypeId: 27 },
      { name: 'مان', carTypeId: 27 },

      { name: 'افيو', carTypeId: 28 },
      { name: 'اليرو', carTypeId: 28 },
      { name: 'اوبترا', carTypeId: 28 },
      { name: 'بونتباك', carTypeId: 28 },
      { name: 'ترافرس', carTypeId: 28 },
      { name: 'سبارك', carTypeId: 28 },
      { name: 'سلفرادو', carTypeId: 28 },
      { name: 'كابتيفا', carTypeId: 28 },
      { name: 'كافلير', carTypeId: 28 },
      { name: 'كروز', carTypeId: 28 },
      { name: 'ماليبو', carTypeId: 28 },

      { name: 'F-150 تندر', carTypeId: 29 },
      { name: 'S MAX', carTypeId: 29 },
      { name: 'اسكورت', carTypeId: 29 },
      { name: 'اكسبلورر', carTypeId: 29 },
      { name: 'ايدج', carTypeId: 29 },
      { name: 'ايكو لاين', carTypeId: 29 },
      { name: 'ترانزيت', carTypeId: 29 },
      { name: 'ترايسر', carTypeId: 29 },
      { name: 'سيرا', carTypeId: 29 },
      { name: 'فوكس', carTypeId: 29 },
      { name: 'فيستا', carTypeId: 29 },
      { name: 'فيوجن', carTypeId: 29 },
      { name: 'كوجا', carTypeId: 29 },
      { name: 'كورتينا', carTypeId: 29 },
      { name: 'كونيكت', carTypeId: 29 },
      { name: 'موستانغ', carTypeId: 29 },
      { name: 'مونديو', carTypeId: 29 },
      { name: 'مونديو', carTypeId: 29 },

      { name: 'FH 12', carTypeId: 30 },
      { name: 'FH 16', carTypeId: 30 },
      { name: 'FL 10', carTypeId: 30 },
      { name: 'FL 12', carTypeId: 30 },
      { name: 'FL 7', carTypeId: 30 },
      { name: 'FM 10', carTypeId: 30 },
      { name: 'FM 12', carTypeId: 30 },
      { name: 'FM 7', carTypeId: 30 },
      { name: 'N10', carTypeId: 30 },
      { name: 'N12', carTypeId: 30 },

      { name: 'CC', carTypeId: 31 },
      { name: 'GTI', carTypeId: 31 },
      { name: 'LT', carTypeId: 31 },
      { name: 'أماروك', carTypeId: 31 },
      { name: 'اب', carTypeId: 31 },
      { name: 'ارتيون', carTypeId: 31 },
      { name: 'باسات', carTypeId: 31 },
      { name: 'بورا', carTypeId: 31 },
      { name: 'بولو', carTypeId: 31 },
      { name: 'بيتل', carTypeId: 31 },
      { name: 'ترانسبورتر', carTypeId: 31 },
      { name: 'توران', carTypeId: 31 },
      { name: 'تيجوان', carTypeId: 31 },
      { name: 'جولف', carTypeId: 31 },
      { name: 'جولف R', carTypeId: 31 },
      { name: 'جولف بلس', carTypeId: 31 },
      { name: 'جيتا', carTypeId: 31 },
      { name: 'شيروكو', carTypeId: 31 },
      { name: 'طوارق', carTypeId: 31 },
      { name: 'فايتون', carTypeId: 31 },
      { name: 'فينتو', carTypeId: 31 },
      { name: 'كادي', carTypeId: 31 },
      { name: 'كبينة', carTypeId: 31 },
      { name: 'كرافتر', carTypeId: 31 },
      { name: 'كرافيل', carTypeId: 31 },

      {
        name: '127',
        carTypeId: 32
      },
      {
        name: '500',
        carTypeId: 32
      },
      {
        name: 'اوتوبيانكي',
        carTypeId: 32
      },
      {
        name: 'اونو',
        carTypeId: 32
      },
      {
        name: 'باندا',
        carTypeId: 32
      },
      {
        name: 'برافو',
        carTypeId: 32
      },
      {
        name: 'بونتو',
        carTypeId: 32
      },
      {
        name: 'تيبو',
        carTypeId: 32
      },
      {
        name: 'تيمبرا',
        carTypeId: 32
      },
      {
        name: 'دوبلو',
        carTypeId: 32
      },
      {
        name: 'فرينو',
        carTypeId: 32
      },
      {
        name: 'كيوبو',
        carTypeId: 32
      },
      {
        name: 'لينيا',
        carTypeId: 32
      },


      {
        name: 'CTS',
        carTypeId: 33
      },
      
      {
        name: 'اوبتيما',
        carTypeId: 35
      },
      {
        name: 'برايد',
        carTypeId: 35
      },
      {
        name: 'بيكانتو',
        carTypeId: 35
      },
      {
        name: 'ريو',
        carTypeId: 35
      },
      {
        name: 'سبورتاج',
        carTypeId: 35
      },
      {
        name: 'ستنغر',
        carTypeId: 35
      },
      {
        name: 'ستونك',
        carTypeId: 35
      },
      {
        name: 'سورينتو',
        carTypeId: 35
      },
      {
        name: 'سول',
        carTypeId: 35
      },
      {
        name: 'سيراتو',
        carTypeId: 35
      },
      {
        name: 'سييد',
        carTypeId: 35
      },
      {
        name: 'فورتي',
        carTypeId: 35
      },
      {
        name: 'كارنيفال',
        carTypeId: 35
      },
      {
        name: 'كارينز',
        carTypeId: 35
      },
      {
        name: 'ماجنتيس',
        carTypeId: 35
      },
      {
        name: 'مورننغ',
        carTypeId: 35
      },
      {
        name: 'نيرو',
        carTypeId: 35
      },


      {
        name: 'ديسكفري',
        carTypeId: 36
      },
      {
        name: 'ديفندر',
        carTypeId: 36
      },
      {
        name: 'رينج روفر',
        carTypeId: 36
      },
      {
        name: 'رينج روفر سبورت',
        carTypeId: 36
      },
      {
        name: 'فري لاندر',
        carTypeId: 36
      },

      {
        name: '3',
        carTypeId: 37
      },
      {
        name: '323',
        carTypeId: 37
      },
      {
        name: '325',
        carTypeId: 37
      },
      {
        name: '5',
        carTypeId: 37
      },
      {
        name: '6',
        carTypeId: 37
      },
      {
        name: 'BT50',
        carTypeId: 37
      },
      {
        name: 'دميو',
        carTypeId: 37
      },
      {
        name: 'لانتس',
        carTypeId: 37
      },

      {name: ' ML 320', carTypeId: 38},
      {name: '170', carTypeId: 38},
      {name: '180', carTypeId: 38},
      {name: '190', carTypeId: 38},
      {name: '200', carTypeId: 38},
      {name: '207', carTypeId: 38},
      {name: '220', carTypeId: 38},
      {name: '230', carTypeId: 38},
      {name: '240', carTypeId: 38},
      {name: '250', carTypeId: 38},
      {name: '260', carTypeId: 38},
      {name: '280', carTypeId: 38},
      {name: '300', carTypeId: 38},
      {name: '313', carTypeId: 38},
      {name: '350', carTypeId: 38},
      {name: '380', carTypeId: 38},
      {name: '410', carTypeId: 38},
      {name: '411', carTypeId: 38},
      {name: '412', carTypeId: 38},
      {name: '416', carTypeId: 38},
      {name: '518', carTypeId: 38},
      {name: '608', carTypeId: 38},
      {name: '709', carTypeId: 38},
      {name: '814', carTypeId: 38},
      {name: '914', carTypeId: 38},
      {name: 'C180', carTypeId: 38},
      {name: 'C200', carTypeId: 38},
      {name: 'C220', carTypeId: 38},
      {name: 'C250', carTypeId: 38},
      {name: 'C270', carTypeId: 38},
      {name: 'C300', carTypeId: 38},
      {name: 'C63', carTypeId: 38},
      {name: 'CLK', carTypeId: 38},
      {name: 'D412', carTypeId: 38},
      {name: 'E200', carTypeId: 38},
      {name: 'E220', carTypeId: 38},
      {name: 'E230', carTypeId: 38},
      {name: 'E250', carTypeId: 38},
      {name: 'E270', carTypeId: 38},
      {name: 'E280', carTypeId: 38},
      {name: 'E300', carTypeId: 38},
      {name: 'E320', carTypeId: 38},
      {name: 'E350', carTypeId: 38},
      {name: 'E400', carTypeId: 38},
      {name: 'E550', carTypeId: 38},
      {name: 'GL350', carTypeId: 38},
      {name: 'GL450', carTypeId: 38},
      {name: 'GL550', carTypeId: 38},
      {name: 'GL63', carTypeId: 38},
      {name: 'S320', carTypeId: 38},
      {name: 'S400', carTypeId: 38},
      {name: 'SL350', carTypeId: 38},
      {name: 'SL550', carTypeId: 38},
      {name: 'SL63', carTypeId: 38},
      {name: 'SL65', carTypeId: 38},
      {name: 'اتيكو', carTypeId: 38},
      {name: 'سبرنتر', carTypeId: 38},
      {name: 'فيانو', carTypeId: 38},
      {name: 'فيتو', carTypeId: 38}, 

      {name: 'I300', carTypeId: 39},
      {name: 'L200', carTypeId: 39},
      {name: 'L400', carTypeId: 39},
      {name: 'Space Star', carTypeId: 39},
      {name: 'اتراج', carTypeId: 39},
      {name: 'اوت لاندر', carTypeId: 39},
      {name: 'باجيرو', carTypeId: 39},
      {name: 'جالانت', carTypeId: 39},
      {name: 'سبيس ستار', carTypeId: 39},
      {name: 'كاريزما', carTypeId: 39},
      {name: 'لانسر', carTypeId: 39},
      {name: 'ماجنوم', carTypeId: 39},
      {name: 'ميراج', carTypeId: 39}, 

      {name: 'الميرا', carTypeId: 40},
      {name: 'باترول', carTypeId: 40},
      {name: 'باث فايندر', carTypeId: 40},
      {name: 'تيدا', carTypeId: 40},
      {name: 'تيرانو', carTypeId: 40},
      {name: 'جوك', carTypeId: 40},
      {name: 'سني', carTypeId: 40},
      {name: 'كشكاي', carTypeId: 40},
      {name: 'مكسيما', carTypeId: 40}, 
      {name: 'ميكرا', carTypeId: 40},
      {name: 'نافارا', carTypeId: 40},
      {name: 'نوت', carTypeId: 40},
      {name: 'وينر', carTypeId: 40},

      {name: 'CR-V', carTypeId: 41},
      {name: 'اكورد', carTypeId: 41},
      {name: 'سيفيك', carTypeId: 41},

      {name: 'H1', carTypeId: 42},
      {name: 'H100', carTypeId: 42},
      {name: 'i10', carTypeId: 42},
      {name: 'i20', carTypeId: 42},
      {name: 'i25', carTypeId: 42},
      {name: 'i30', carTypeId: 42},
      {name: 'i40', carTypeId: 42},
      {name: 'ix35', carTypeId: 42},
      {name: 'ix55', carTypeId: 42},
      {name: 'اتوس', carTypeId: 42},
      {name: 'ازيرا', carTypeId: 42},
      {name: 'افانتي', carTypeId: 42},
      {name: 'اكسنت', carTypeId: 42},
      {name: 'الانترا', carTypeId: 42},
      {name: 'ايونيك', carTypeId: 42},
      {name: 'تراجيت', carTypeId: 42},
      {name: 'توسان', carTypeId: 42},
      {name: 'توكسون', carTypeId: 42},
      {name: 'تيراكان', carTypeId: 42},
      {name: 'جالوبر', carTypeId: 42},
      {name: 'جيتس', carTypeId: 42},
      {name: 'سانتافيه', carTypeId: 42},
      {name: 'سوناتا', carTypeId: 42},
      {name: 'فيرنا', carTypeId: 42},
      {name: 'فيلوستر', carTypeId: 42},
      {name: 'فينيو', carTypeId: 42},
      {name: 'كليك', carTypeId: 42},
      {name: 'كوبيه', carTypeId: 42},
      {name: 'كونا', carTypeId: 42},
      {name: 'ماتركس', carTypeId: 42},
     

  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CarModels', null, {});
  }
};
