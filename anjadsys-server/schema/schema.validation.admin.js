const Joi = require("joi");

module.exports = {
  userSchema: {
    create: Joi.object().keys({
      identityNum: Joi.string()
      .pattern(/^[0-9]{9}$/)
      .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
      .optional(),
      username: Joi.string().trim().required().min(3),
      companyName: Joi.string().trim().min(3).optional(),
      password: Joi.string().trim().required().label('password'),
      confirmPassword: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .strip() //remove it from body after validation
        .label("Confirm password")
        .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
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
      agentID: Joi.string().trim().optional(),
      regionId: Joi.number().min(1).required(),
      roleId: Joi.number().min(1).required(),
    }),
    update: Joi.object().keys({
      id: Joi.string().trim().min(6).required(),
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
      agentID: Joi.string().trim().optional(),
      regionId: Joi.number().min(1).optional(),
      roleId: Joi.number().min(1).optional(),
    }),
    delete: Joi.object().keys({
      username: Joi.string().trim()
      .pattern(/^(SUP-\d{5})$|^(AG-\d{6})$|^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}})
    }),
    list: Joi.object().keys({
      role: Joi.string().trim().min(5).optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      agentID: Joi.string().trim().min(9).max(9).optional(),
      userID: Joi.string().trim().min(6).max(10).optional(), //TODO convert it to customerID
      companyName: Joi.string().trim().optional(),
      username: Joi.string().trim().optional(),
    }),
  },
  createSupplier: Joi.object().keys({
    identityNum: Joi.string()
    .pattern(/^[0-9]{9}$/)
    .options({ messages: { 'string.pattern.base': 'رقم الهوية خاطىء' } })
    .optional(),
    username: Joi.string().trim().required().min(3),
    companyName: Joi.string().trim().min(3).optional(),
    address: Joi.string().trim().optional(),
    jawwal1: Joi.number().min(9).required(),
    jawwal2: Joi.number().min(9).optional(),
    fax: Joi.number().min(7).optional(),
    tel: Joi.number().min(7).optional(),
    email: Joi.string().email().optional(),
    note: Joi.string().trim().min(10).optional(),
    regionId: Joi.number().min(1).required(),
    roleId: Joi.number().min(1).required(),
  }),
  serviceSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().min(5).required(),
      coverageDays: Joi.number().min(1).required(),
      cost: Joi.number().min(1).required(),
      note: Joi.any().optional(),
    }),
    update: Joi.object().keys({
      serviceID: Joi.number().required(),
      name: Joi.string().trim().min(5).optional(),
      coverageDays: Joi.number().min(1).optional(),
      cost: Joi.number().min(1).optional(),
      note: Joi.any().optional(),
    }),
    delete: Joi.object().keys({
      serviceID: Joi.number().required()
    }),
    list: Joi.object().keys({
      serviceName: Joi.string().trim().min(1).optional(),
      serviceID: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional()
    }),
  },
  agentLimitsSchema: {
    add: Joi.object().keys({ //TODO no table for agent limits
      debit: Joi.number().min(1).required(),
      agentID: Joi.string().trim().min(9).max(9).required()
    }),
    delete: Joi.object().keys({
      agentLimitID: Joi.number().required()
    }),
    list: Joi.object().keys({
      agentID: Joi.string().trim().min(9).max(9).optional(),
      main: Joi.boolean().optional()
    }),
  },
  carTypeSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().required(),
    }),
    update: Joi.object().keys({
      carTypeId: Joi.number().required(),
      name: Joi.string().trim().required(),
    }),
    list: Joi.object().keys({
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
    }),
    delete: Joi.object().keys({
      carTypeId: Joi.number().required()
    }),
  }, 
  carModelSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().required(),
      carTypeId: Joi.number().required(),
    }),
    update: Joi.object().keys({
      carModelId: Joi.number().required(),
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
    }),
    list: Joi.object().keys({
      carModelId: Joi.number().optional(),
      name: Joi.string().trim().optional(),
      carTypeId: Joi.number().optional(),
    }),
    delete: Joi.object().keys({
      carModelId: Joi.number().required()
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
    update: Joi.object().keys({
      carId: Joi.number().required(),
      carNumber: Joi.string().trim().optional(),
      motorNumber: Joi.string().trim().optional(),
      motorPH: Joi.number().min(10).optional(),
      serialNumber: Joi.string().trim().optional(),
      passengersCount: Joi.number().min(1).optional(),
      productionYear: Joi.date().optional(),
      licenseType: Joi.string().optional(),
      note: Joi.any().optional(),
      carTypeId: Joi.number().optional(),
      carModelId: Joi.number().optional(),
      customerId: Joi.string().optional(),
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
      customerId: Joi.string().optional(),
    }),
    delete: Joi.object().keys({
      carId: Joi.number().required()
    }),
  }
};