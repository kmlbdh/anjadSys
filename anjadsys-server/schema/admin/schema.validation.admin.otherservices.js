const Joi = require("joi");

const otherServiceSchema = {
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
};

module.exports = otherServiceSchema;