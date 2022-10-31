const Joi = require("joi");

const carModelSchema = {
  add: Joi.object().keys({
    name: Joi.string().trim().required(),
    carTypeId: Joi.number().required(),
  }),
  update: Joi.object().keys({
    name: Joi.string().trim().optional(),
    carTypeId: Joi.number().optional(),
  }),
  carModelId: Joi.any().required(),
  list: Joi.object().keys({
    carModelId: Joi.number().optional(),
    name: Joi.string().trim().optional(),
    carTypeId: Joi.number().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = carModelSchema;