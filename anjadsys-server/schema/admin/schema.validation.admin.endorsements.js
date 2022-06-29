const Joi = require("joi");

const endorsementSchema = {
  add: Joi.object().keys({
    totalPrice: Joi.number().optional(),
    expireDate: Joi.date().optional(),
    note: Joi.any().optional(),
    endorsementType: Joi.number().required(),
    carId: Joi.number().required(),
    insurancePolicyId: Joi.number().required(),
  }),
  update: Joi.object().keys({
    totalPrice: Joi.number().optional(),
    expireDate: Joi.date().optional(),
    note: Joi.any().optional(),
    endorsementType: Joi.number().optional(),
    carId: Joi.number().optional(),
    insurancePolicyId: Joi.number().optional(),
  }),
  endorsementId: Joi.any().required(),
  list: Joi.object().keys({
    expireDate: Joi.date().optional(),
    endorsementType: Joi.number().optional(),
    carId: Joi.number().optional(),
    insurancePolicyId: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }),
};

module.exports = endorsementSchema;