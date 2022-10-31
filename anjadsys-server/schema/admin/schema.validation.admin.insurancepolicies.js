const Joi = require("joi");

const ServicePolicy = Joi.object().keys({
  id: Joi.number().optional(),
  cost: Joi.number().required(),
  additionalDays: Joi.number().required(),
  note: Joi.any().optional(),
  serviceId: Joi.number().required(),
  supplierId: Joi.string().optional(),
  insurancePolicyId: Joi.number().optional(),
  supplierPercentage: Joi.number().required(),
});

const insurancePolicySchema = {
  add: Joi.object().keys({
    totalPrice: Joi.number().required(),
    expireDate: Joi.date().required(),
    note: Joi.any().optional(),
    services: Joi.array().items(ServicePolicy).required(),
    customerId: Joi.string().required(),
    agentId: Joi.string().required(),
    carId: Joi.number().required(),
  }),
  update: Joi.object().keys({
    totalPrice: Joi.number().optional(),
    expireDate: Joi.date().optional(),
    note: Joi.any().optional(),
    services: Joi.array().items(ServicePolicy).optional(),
    customerId: Joi.string().optional(),
    agentId: Joi.string().optional(),
    carId: Joi.number().optional(),
  }),
  insurancePolicyId: Joi.any().required(),
  list: Joi.object().keys({
    insurancePolicyId: Joi.number().optional(),
    customerID: Joi.string().optional(),
    agentID: Joi.string().optional(),
    carID: Joi.number().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
    filterOutValid: Joi.boolean().optional(),
  }),
};

module.exports = insurancePolicySchema;