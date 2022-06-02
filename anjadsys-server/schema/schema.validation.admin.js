const Joi = require("joi");

const ServicePolicy = Joi.object().keys({
  id: Joi.number().optional(),
  cost: Joi.number().required(),
  additionalDays: Joi.number().required(),
  note: Joi.any().optional(),
  serviceId: Joi.number().required(),
  supplierId: Joi.string().optional(),
  insurancePolicyId: Joi.number().optional(),
  supplierPercentage: Joi.number().required(),
});

const ServiceAccident = Joi.object().keys({
  id: Joi.number().optional(),
  coverageDays: Joi.number().required(),
  note: Joi.any().optional(),
  serviceId: Joi.number().required(),
  supplierId: Joi.string().optional(),
  accidentId: Joi.number().optional(),
});

module.exports = {
  userSchema: {
    create: Joi.object().keys({
      identityNum: Joi.string()
      .pattern(/^[0-9]{9}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
      .optional()
      .allow(null),
      username: Joi.string().trim().required().min(3),
      companyName: Joi.string().trim().min(3).optional().allow(null),
      password: Joi.string().trim().optional().label('password'),
      confirmPassword: Joi.any()
        .equal(Joi.ref('password'))
        .optional()
        .strip() //remove it from body after validation
        .label("Confirm password")
        .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } })
        .allow(null),
      address: Joi.string().trim().optional().allow(null),
      jawwal1: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الأول خاطىء' } })
      .required(),
      jawwal2: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الثاني خاطىء' } })
      .optional()
      .allow(null),
      fax: Joi.number().min(7).optional().allow(null),
      tel: Joi.number().min(7).optional().allow(null),
      email: Joi.string().email()
      .options({ messages: { 'string.email': 'البريد الالكتروني خاطىء' } })
      .optional().allow(null),
      note: Joi.string().trim().optional().allow(null),
      agentId: Joi.string().trim().optional().allow(null),
      regionId: Joi.number().min(1).required(),
      roleId: Joi.number().min(1).required(),
      blocked: Joi.boolean().required(),
    }),
    userID: Joi.any().required(),
    update: Joi.object().keys({
      // id: Joi.string().trim().min(6).required(),
      identityNum: Joi.string()
      .pattern(/^[0-9]{9}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
      .optional(),
      username: Joi.string().trim().optional(),
      companyName: Joi.string().optional(),
      password: Joi.string().trim().optional().label('password'),
      confirmPassword: Joi.any()
        .equal(Joi.ref('password'))
        .optional()
        .strip() //remove it from body after validation
        .label("Confirm password")
        .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
      address: Joi.string().trim().optional(),
      jawwal1: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الأول خاطىء' } })
      .optional(),
      jawwal2: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الجوال الثاني خاطىء' } })
      .optional(),
      fax: Joi.number().min(7).optional(),
      tel: Joi.number().min(7).optional(),
      email: Joi.string().email()
      .options({ messages: { 'string.email.base': 'البريد الالكتروني خاطىء' } })
      .optional(),
      note: Joi.string().trim().optional(),
      agentId: Joi.string().trim().optional().allow(null),
      regionId: Joi.number().min(1).optional(),
      roleId: Joi.number().min(1).optional(),
      blocked: Joi.boolean().optional(),
    }),
    // delete: Joi.object().keys({
    //   username: Joi.string().trim()
    //   .pattern(/^(AD-\d{3})$|(SUP-\d{5})$|^(AG-\d{6})$|^(C-\d{8})$/)
    //   .required()
    //   .options({messages: {"string.pattern.base": "username is wrong!"}})
    // }),
    list: Joi.object().keys({
      role: Joi.string().trim().min(5).optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      agentID: Joi.string().trim().min(9).max(9).optional(),
      userID: Joi.string().trim().min(6).max(10).optional(), //TODO convert it to customerID
      companyName: Joi.string().trim().optional(),
      username: Joi.string().trim().optional(),
      regionID: Joi.number().optional(),
      agent: Joi.boolean().default(false).optional(),
      blocked: Joi.boolean().optional(),
    }),
  },
  serviceSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().min(2).required(),
      coverageDays: Joi.number().required(),
      cost: Joi.number().min(1).required(),
      note: Joi.any().optional(),
      supplierPercentage: Joi.number().required(),
    }),
    serviceID: Joi.any().required(),
    update: Joi.object().keys({
      // serviceID: Joi.number().required(),
      name: Joi.string().trim().min(2).optional(),
      coverageDays: Joi.number().optional(),
      cost: Joi.number().min(1).optional(),
      note: Joi.any().optional(),
      supplierPercentage: Joi.number().optional(),
    }),
    // delete: Joi.object().keys({
    //   serviceID: Joi.number().required()
    // }),
    list: Joi.object().keys({
      serviceName: Joi.string().trim().min(1).optional(),
      serviceID: Joi.number().allow(null).min(1).optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional()
    }),
  },
  otherServiceSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().min(2).required(),
      serviceKind: Joi.string().trim().required(),
      fileStatus: Joi.string().trim().required(),
      descCustomer: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      cost: Joi.number().min(1).required(),
      customerId: Joi.string().trim().required(),
      insurancePolicyId: Joi.number().required(),
    }),
    update: Joi.object().keys({
      name: Joi.string().trim().optional(),
      serviceKind: Joi.string().trim().optional(),
      fileStatus: Joi.string().trim().optional(),
      descCustomer: Joi.string().trim().optional(),
      description: Joi.string().trim().optional(),
      cost: Joi.number().min(1).optional(),
      customerId: Joi.string().trim().optional(),
      insurancePolicyId: Joi.number().optional(),
    }),
    otherServiceID: Joi.any().required(),
    // delete: Joi.object().keys({
    //   otherServiceID: Joi.number().required(),
    // }),
    list: Joi.object().keys({
      otherServiceID: Joi.number().optional(),
      serviceKind: Joi.string().trim().optional(),
      fileStatus: Joi.string().trim().optional(),
      customerID: Joi.string().trim().optional(),
      insurancePolicyId: Joi.number().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional()
    }),
  },
  agentLimitsSchema: {
    add: Joi.object().keys({ //TODO no table for agent limits
      debit: Joi.number().min(1).required(),
      agentID: Joi.string().trim().min(9).max(9).required()
    }),
    agentLimitID: Joi.any().required(),
    // delete: Joi.object().keys({
    //   agentLimitID: Joi.number().required()
    // }),
    list: Joi.object().keys({
      agentID: Joi.string().trim().min(9).max(9).optional(),
      main: Joi.boolean().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  carTypeSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().required(),
    }),
    update: Joi.object().keys({
      name: Joi.string().trim().required(),
    }),
    carTypeId: Joi.any().required(),
    // delete: Joi.object().keys({
    //   carTypeId: Joi.number().required()
    // }),
    list: Joi.object().keys({
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  }, 
  carModelSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().required(),
      carTypeId: Joi.number().required(),
    }),
    update: Joi.object().keys({
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
    }),
    carModelId: Joi.any().required(),
    // delete: Joi.object().keys({
    //   carModelId: Joi.number().required()
    // }),
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
      color: Joi.string().trim().required(),
      note: Joi.any().optional(),
      carTypeId: Joi.number().required(),
      carModelId: Joi.number().required(),
      customerId: Joi.string().required(),
    }),
    carId: Joi.any().required(),
    update: Joi.object().keys({
      carNumber: Joi.string().trim().optional(),
      motorNumber: Joi.string().trim().optional(),
      motorPH: Joi.number().min(10).optional(),
      serialNumber: Joi.string().trim().optional(),
      passengersCount: Joi.number().min(1).optional(),
      productionYear: Joi.date().optional(),
      licenseType: Joi.string().optional(),
      color: Joi.string().trim().optional(),
      note: Joi.any().optional(),
      carTypeId: Joi.number().optional(),
      carModelId: Joi.number().optional(),
      customerId: Joi.string().optional(),
    }),
    // delete: Joi.object().keys({
    //   carId: Joi.number().required()
    // }),
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
      // name: Joi.string().trim().required(),
      accidentPlace: Joi.string().trim().required(),
      accidentDate: Joi.date().required(),
      registerAccidentDate: Joi.date().required(),
      driverName: Joi.string().trim().required(),
      driverIdentity: Joi.number().min(1).required(),
      accidentDescription: Joi.string().trim().required(),
      expectedCost: Joi.number().required(),
      note: Joi.any().optional(),
      services: Joi.array().items(ServiceAccident).required(),
      regionId: Joi.number().required(),
      customerId: Joi.string().required(),
      agentId: Joi.string().required(),
      carId: Joi.number().required(),
    }),
    update: Joi.object().keys({
      // name: Joi.string().trim().optional(),
      accidentPlace: Joi.string().trim().optional(),
      accidentDate: Joi.date().optional(),
      registerAccidentDate: Joi.date().optional(),
      driverName: Joi.string().trim().optional(),
      driverIdentity: Joi.number().min(1).optional(),
      accidentDescription: Joi.string().trim().optional(),
      expectedCost: Joi.number().optional(),
      note: Joi.any().optional(),
      services: Joi.array().items(ServiceAccident).optional(),
      regionId: Joi.number().optional(),
      customerId: Joi.number().optional(),
      agentId: Joi.string().optional(),
      carId: Joi.number().optional(),
    }),
    accidentId: Joi.any().required(),
    // delete: Joi.object().keys({
    //   accidentID: Joi.number().required()
    // }),
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
      agentID: Joi.string().optional(),
      carID: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  insurancePolicySchema: {
    add: Joi.object().keys({
      totalPrice: Joi.number().required(),
      expireDate: Joi.date().required(),
      note: Joi.any().optional(),
      services: Joi.array().items(ServicePolicy).required(),
      customerId: Joi.string().required(),
      agentId: Joi.string().required(),
      carId: Joi.number().required(),
    }),
    update: Joi.object().keys({
      totalPrice: Joi.number().optional(),
      expireDate: Joi.date().optional(),
      note: Joi.any().optional(),
      services: Joi.array().items(ServicePolicy).optional(),
      customerId: Joi.string().optional(),
      agentId: Joi.string().optional(),
      carId: Joi.number().optional(),
    }),
    insurancePolicyId: Joi.any().required(),
    // delete: Joi.object().keys({
    //   insurancePolicyId: Joi.number().required()
    // }),
    list: Joi.object().keys({
      insurancePolicyId: Joi.number().optional(),
      customerID: Joi.string().optional(),
      agentID: Joi.string().optional(),
      carID: Joi.number().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
      filterOutValid: Joi.boolean().optional(),
    }),
  },
  accountSchema: {
    list: Joi.object().keys({
      accountId: Joi.number().optional(),
      insurancePolicyId: Joi.number().optional(),
      otherServiceId: Joi.number().optional(),
      customerID: Joi.string().optional(),
      supplierID: Joi.string().optional(),
      agentID: Joi.string().trim().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  supplierSchema:{
    create: Joi.object().keys({
      identityNum: Joi.string()
      .pattern(/^[0-9]{9}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
      .optional()
      .allow(null),
      username: Joi.string().trim().required().min(3),
      companyName: Joi.string().trim().min(3).required(),
      address: Joi.string().trim().optional().allow(null),
      jawwal1: Joi.number().min(9).required(),
      jawwal2: Joi.number().min(9).optional().allow(null),
      fax: Joi.number().min(7).optional().allow(null),
      tel: Joi.number().min(7).optional().allow(null),
      email: Joi.string().email().optional().allow(null),
      note: Joi.string().trim().min(10).optional().allow(null),
      regionId: Joi.number().min(1).required(),
      roleId: Joi.number().min(1).required(),
      blocked: Joi.boolean().required(),
    }),
    list: Joi.object().keys({
      flag: Joi.string().trim().required(),
      supplierID: Joi.string().trim().required(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      skip: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  }
};
