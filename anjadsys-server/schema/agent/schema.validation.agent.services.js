const Joi = require("joi");

const serviceSchema = {
  list: Joi.object().keys({
    serviceName: Joi.string().trim().min(1).optional(),
    serviceID: Joi.number().min(1).optional(),
    limit: Joi.number().optional(),
    skip: Joi.number().optional()
  }),
};

module.exports = serviceSchema;