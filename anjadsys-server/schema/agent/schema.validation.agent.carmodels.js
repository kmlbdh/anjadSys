const Joi = require("joi");

const carModelSchema = {
  list: Joi.object().keys({
    carModelId: Joi.number().optional(),
    name: Joi.string().trim().optional(),
    carTypeId: Joi.number().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = carModelSchema;