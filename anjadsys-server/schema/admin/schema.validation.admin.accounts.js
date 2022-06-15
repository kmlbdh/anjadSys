const Joi = require("joi");

const accountSchema = {
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
};

module.exports = accountSchema;