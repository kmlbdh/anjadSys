const Joi = require("joi");

module.exports.schema = {
  createUser: Joi.object().keys({
    username: Joi.string().trim().required().min(3),
    nickname: Joi.string().trim().min(3).optional(),
    password: Joi.string().trim().required().label('password'),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .strip() //remove it from body after validation
      .label("Confirm password")
      .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
    phone: Joi.number().min(9).optional(),
    address: Joi.string().trim().optional(),
    tel: Joi.number().min(7).optional(),
    note: Joi.string().trim().min(10).optional(),
    role: Joi.string().trim().required().min(5),
    agent: Joi.object().keys({
      agentID: Joi.string().trim().optional(),
      agentNickname: Joi.string().trim().optional(),
    }).optional(),
  }),
  createUserForAgent: Joi.object().keys({
    username: Joi.string().trim().required().min(3),
    nickname: Joi.string().trim().min(3).optional(),
    password: Joi.string().trim().required().label('password'),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .strip() //remove it from body after validation
      .label("Confirm password")
      .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
    phone: Joi.number().min(9).optional(),
    address: Joi.string().trim().optional(),
    tel: Joi.number().min(7).optional(),
    note: Joi.string().trim().min(10).optional()
  }),
  login: Joi.object().keys({
    username: Joi.string().trim()
      .pattern(/^(AD-\d{3})$|^(AG-\d{6})$|^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}}),
    password: Joi.string().trim().required()
  }),
  deleteUserForAdmin: Joi.object().keys({
    username: Joi.string().trim()
    .pattern(/^(SUP-\d{5})$|^(AG-\d{6})$|^(C-\d{8})$/)
    .required()
    .options({messages: {"string.pattern.base": "username is wrong!"}})
  }),
  deleteUserForAgent: Joi.object().keys({
    username: Joi.string().trim()
    .pattern(/^(C-\d{8})$/)
    .required()
    .options({messages: {"string.pattern.base": "username is wrong!"}})
  }),
  createSupplierForAdmin: Joi.object().keys({
    username: Joi.string().trim().required().min(3),
    nickname: Joi.string().trim().min(3).optional(),
    address: Joi.string().trim().min(3).optional(),
    phone: Joi.number().min(9).optional(),
    tel: Joi.number().min(7).optional(),
    note: Joi.string().trim().min(10).optional(),
  }),
  deleteSupplierPartsForAdmin: Joi.object().keys({
    supplierPartsID: Joi.string().trim().required()
  }),
  listSupplierPartsForAdmin: Joi.object().keys({
    supplierID: Joi.string().trim().optional(),
    partNo: Joi.number().optional(),
    partName: Joi.string().trim().optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional()
  }),
  listUsersForAdmin: Joi.object().keys({
    role: Joi.string().trim().min(5).optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    agentID: Joi.string().trim().min(9).max(9).optional(),
    userID: Joi.string().trim().min(10).max(10).optional(),
    nickname: Joi.string().trim().optional(),
    username: Joi.string().trim().optional(),
  }),
  addServiceForAdmin: Joi.object().keys({
    serviceName: Joi.string().trim().min(5).required(),
    coverageDays: Joi.number().min(1).required(),
    cost: Joi.number().min(1).required(),
    note: Joi.string().trim().optional(),
    dailyCost: Joi.number().optional(),
  }),
  deleteServiceForAdmin: Joi.object().keys({
    serviceID: Joi.string().trim().required()
  }),
  listServicesForAdmin: Joi.object().keys({
    serviceName: Joi.string().trim().min(1).optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional()
  }),
  addSupplierPartsForAdmin: Joi.object().keys({
    partNo: Joi.number().optional(),
    partName: Joi.string().trim().required(),
    quantity: Joi.number().min(1).required(),
    cost: Joi.number().min(1).required(),
    supplierID: Joi.string().min(9).max(9).required(),
  }),
  addAgentLimitsForAdmin: Joi.object().keys({
    limitAmount: Joi.number().min(1).required(),
    agentID: Joi.string().trim().min(9).max(9).required()
  }),
  deleteAgentLimitsForAdmin: Joi.object().keys({
    agentLimitID: Joi.string().trim().required()
  }),
  listMainAgentLimitsForAdmin: Joi.object().keys({
    agentID: Joi.string().trim().min(9).max(9).optional()
  }),
  listUsersForAgent: Joi.object().keys({
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    userID: Joi.string().trim().min(10).max(10).optional(),
    nickname: Joi.string().trim().optional(),
  }),
  addServiceToCustomerOfAgent: Joi.object().keys({
    userID: Joi.string().min(10).max(10).required(),
    serviceName: Joi.string().trim().required(),
    serviceID: Joi.string().trim().required(),
    price: Joi.number().min(1).required(),
    period: Joi.number().min(1).required(),
    additionalDays: Joi.number().optional(),
    dailyCost: Joi.number().optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
  deleteServiceToCustomerOfAgent: Joi.object().keys({
    customerServiceID: Joi.string().trim().required()
  }),
};