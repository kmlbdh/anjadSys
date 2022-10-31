const Joi = require("joi");

const serviceSchema = {
  add: Joi.object().keys({
    name: Joi.string().trim().min(2).required(),
    coverageDays: Joi.number().required(),
    cost: Joi.number().min(1).required(),
    note: Joi.any().optional(),
    supplierPercentage: Joi.number().required(),
    packageType: Joi.number().required(),
  }),
  serviceID: Joi.any().required(),
  update: Joi.object().keys({
    // serviceID: Joi.number().required(),
    name: Joi.string().trim().min(2).optional(),
    coverageDays: Joi.number().optional(),
    cost: Joi.number().min(1).optional(),
    note: Joi.any().optional(),
    supplierPercentage: Joi.number().optional(),
    packageType: Joi.number().optional(),
  }),
  list: Joi.object().keys({
    serviceName: Joi.string().trim().min(1).optional(),
    serviceID: Joi.number().allow(null).min(1).optional(),
    packageType: Joi.number().optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional()
  }),
};

module.exports = serviceSchema;