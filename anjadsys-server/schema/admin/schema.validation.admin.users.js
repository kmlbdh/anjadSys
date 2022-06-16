const Joi = require("joi");

const userSchema = {
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
    servicesPackage: Joi.number().optional(),
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
    servicesPackage: Joi.number().optional(),
    blocked: Joi.boolean().optional(),
  }),
  list: Joi.object().keys({
    role: Joi.string().trim().min(5).optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    agentID: Joi.string().trim().min(9).max(9).optional(),
    userID: Joi.string().trim().min(6).max(10).optional(), //TODO convert it to customerID
    identityNum: Joi.number().optional(),
    companyName: Joi.string().trim().optional(),
    username: Joi.string().trim().optional(),
    regionID: Joi.number().optional(),
    agent: Joi.boolean().default(false).optional(),
    blocked: Joi.boolean().optional(),
  }),
};

module.exports = userSchema;