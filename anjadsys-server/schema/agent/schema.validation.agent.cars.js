const Joi = require("joi");

const carSchema = {
  add: Joi.object().keys({
    carNumber: Joi.string().trim().required(),
    motorNumber: Joi.string().trim().required(),
    motorPH: Joi.number().min(10).required(),
    serialNumber: Joi.string().trim().required(),
    passengersCount: Joi.number().min(1).required(),
    productionYear: Joi.date().required(),
    color: Joi.string().trim().required(),
    licenseType: Joi.string().required(),
    note: Joi.any().optional(),
    carTypeId: Joi.number().required(),
    carModelId: Joi.number().required(),
    customerId: Joi.string().required(),
  }),
  list: Joi.object().keys({
    carId: Joi.number().optional(),
    carNumber: Joi.string().trim().optional(),
    motorNumber: Joi.string().trim().optional(),
    serialNumber: Joi.string().trim().optional(),
    productionYear: Joi.date().optional(),
    licenseType: Joi.string().optional(),
    carTypeId: Joi.number().optional(),
    carModelId: Joi.number().optional(),
    customerID: Joi.string().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = carSchema;