const Joi = require("joi");

const ServicePolicy = Joi.object().keys({
  id: Joi.number().optional(),
  cost: Joi.number().required(),
  additionalDays: Joi.number().required(),
  note: Joi.any().optional(),
  serviceId: Joi.number().required(),
  supplierId: Joi.string().optional(),
  insurancePolicyId: Joi.number().optional(),
});

module.exports = {
  userSchema: {
    create: Joi.object().keys({
      identityNum: Joi.string()
      .pattern(/^[0-9]{9}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
      .optional(),
      username: Joi.string().trim().required().min(3),
      address: Joi.string().trim().optional(),
      jawwal1: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الأول خاطىء' } })
      .required(),
      jawwal2: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الثاني خاطىء' } })
      .optional(),
      fax: Joi.number().min(7).optional(),
      tel: Joi.number().min(7).optional(),
      email: Joi.string().email()
      .options({ messages: { 'string.email': 'البريد الالكتروني خاطىء' } })
      .optional(),
      note: Joi.string().trim().optional(),
      regionId: Joi.number().min(1).required(),
      blocked: Joi.boolean().optional(),
    }),
    list: Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      userID: Joi.string().trim().min(6).max(10).optional(), //TODO convert it to customerID
      companyName: Joi.string().trim().optional(),
      username: Joi.string().trim().optional(),
      regionID: Joi.number().optional(),
    }),
    listSuppliers: Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      userID: Joi.string().trim().min(6).max(10).optional(), //TODO convert it to customerID
      regionID: Joi.number().optional(),
      companyName: Joi.string().trim().optional(),
      username: Joi.string().trim().optional(),
    }),
  },
  serviceSchema: {
    list: Joi.object().keys({
      serviceName: Joi.string().trim().min(1).optional(),
      serviceID: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional()
    }),
  },
  carTypeSchema: {
    list: Joi.object().keys({
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  }, 
  carModelSchema: {
    list: Joi.object().keys({
      carModelId: Joi.number().optional(),
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  carSchema: {
    add: Joi.object().keys({
      carNumber: Joi.string().trim().required(),
      motorNumber: Joi.string().trim().required(),
      motorPH: Joi.number().min(10).required(),
      serialNumber: Joi.string().trim().required(),
      passengersCount: Joi.number().min(1).required(),
      productionYear: Joi.date().required(),
      licenseType: Joi.string().required(),
      note: Joi.any().optional(),
      carTypeId: Joi.number().required(),
      carModelId: Joi.number().required(),
      customerId: Joi.string().required(),
    }),
    list: Joi.object().keys({
      carId: Joi.number().optional(),
      carNumber: Joi.string().trim().optional(),
      motorNumber: Joi.string().trim().optional(),
      serialNumber: Joi.string().trim().optional(),
      productionYear: Joi.date().optional(),
      licenseType: Joi.string().optional(),
      carTypeId: Joi.number().optional(),
      carModelId: Joi.number().optional(),
      customerID: Joi.string().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  accidentSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().required(),
      accidentPlace: Joi.string().trim().required(),
      accidentDate: Joi.date().required(),
      registerAccidentDate: Joi.date().required(),
      driverName: Joi.string().trim().required(),
      driverIdentity: Joi.number().min(1).required(),
      accidentDescription: Joi.string().trim().required(),
      expectedCost: Joi.number().required(),
      note: Joi.any().optional(),
      services: Joi.array().required(),
      regionId: Joi.number().required(),
      customerId: Joi.string().required(),
      carId: Joi.number().required(),
    }),
    list: Joi.object().keys({
      accidentID: Joi.number().optional(),
      carNumber: Joi.number().optional(),
      accidentPlace: Joi.string().trim().optional(),
      accidentDate: Joi.date().optional(),
      registerAccidentDate: Joi.date().optional(),
      driverName: Joi.string().trim().optional(),
      driverIdentity: Joi.number().min(1).optional(),
      regionId: Joi.number().optional(),
      customerID: Joi.string().optional(),
      carID: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  insurancePolicySchema: {
    add: Joi.object().keys({
      totalPrice: Joi.number().required(),
      note: Joi.any().optional(),
      services: Joi.array().items(ServicePolicy).required(),
      customerId: Joi.string().required(),
      carId: Joi.number().required(),
    }),
    list: Joi.object().keys({
      insurancePolicyId: Joi.number().optional(),
      totalPrice: Joi.number().optional(),
      note: Joi.any().optional(),
      customerID: Joi.string().optional(),
      carID: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  accountSchema: {
    list: Joi.object().keys({
      accountId: Joi.number().optional(),
      insurancePolicyId: Joi.number().optional(),
      customerID: Joi.string().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  }
};