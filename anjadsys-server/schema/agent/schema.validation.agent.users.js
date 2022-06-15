const Joi = require("joi");

const userSchema = {
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
    identityNum: Joi.number().optional(),
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
};

module.exports = userSchema;