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
    phone: Joi.number().required().min(9),
    tel: Joi.number().min(7).optional(),
    note: Joi.string().trim().min(10).optional(),
    role: Joi.string().trim().required().min(5).optional(),
    agent: Joi.object().keys({
      agentID: Joi.string().trim().optional(),
      agentNickname: Joi.string().trim().optional(),
    }).optional(),
  }),
  login: Joi.object().keys({
    username: Joi.string().trim()
      .pattern(/^(AD-\d{3})$|^(AG-\d{6})$|^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}}),
    password: Joi.string().trim().required()
  }),
  listUsersForAdmin: Joi.object().keys({
    role: Joi.string().trim().min(5).optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().min(0).optional(),
    agentID: Joi.string().trim().min(9).max(9).optional(),
    userID: Joi.string().trim().min(10).max(10).optional(),
    nickname: Joi.string().trim().optional(),
  }),
  addServiceForAdmin: Joi.object().keys({
    serviceName: Joi.string().trim().min(5),
    coverageDays: Joi.number().min(1),
    cost: Joi.number().min(1),
    note: Joi.string().trim().optional(),
    dailyCost: Joi.number().optional(),
  }),
  listServicesForAdmin: Joi.object().keys({
    serviceName: Joi.string().trim().min(1).optional()
  }),
  addAgentLimitsForAdmin: Joi.object().keys({
    limitAmount: Joi.number().min(1).required(),
    agentID: Joi.string().trim().min(9).max(9).required()
  }),
  listMainAgentLimitsForAdmin: Joi.object().keys({
    agentID: Joi.string().trim().min(9).max(9).optional()
  }),
  listUsersForAgent: Joi.object().keys({
    limit: Joi.number().optional(),
    skip: Joi.number().min(0).optional(),
    userID: Joi.string().trim().min(10).max(10).optional(),
    nickname: Joi.string().trim().optional(),
  }),
  addServiceToCustomerOfAgent: Joi.object().keys({
    userID: Joi.string().min(10).max(10).required(),
    serviceName: Joi.string().trim().required(),
    serviceID: Joi.string().trim().required(),
    price: Joi.number().min(1).required(),
    period: Joi.number().min(1).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};