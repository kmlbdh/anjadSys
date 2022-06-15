const Joi = require("joi");

const supplierSchema = {
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
};

module.exports = supplierSchema;