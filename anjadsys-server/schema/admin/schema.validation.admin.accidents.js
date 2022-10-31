const Joi = require("joi");

const ServiceAccident = Joi.object().keys({
  id: Joi.number().optional(),
  coverageDays: Joi.number().required(),
  note: Joi.any().optional(),
  serviceId: Joi.number().required(),
  supplierId: Joi.string().optional(),
  accidentId: Joi.number().optional(),
});

const accidentSchema = {
  add: Joi.object().keys({
    // name: Joi.string().trim().required(),
    accidentPlace: Joi.string().trim().required(),
    accidentDate: Joi.date().required(),
    registerAccidentDate: Joi.date().required(),
    driverName: Joi.string().trim().required(),
    driverIdentity: Joi.number().min(1).required(),
    accidentDescription: Joi.string().trim().required(),
    expectedCost: Joi.number().required(),
    note: Joi.any().optional(),
    services: Joi.array().items(ServiceAccident).required(),
    regionId: Joi.number().required(),
    customerId: Joi.string().required(),
    agentId: Joi.string().required(),
    carId: Joi.number().required(),
  }),
  update: Joi.object().keys({
    // name: Joi.string().trim().optional(),
    accidentPlace: Joi.string().trim().optional(),
    accidentDate: Joi.date().optional(),
    registerAccidentDate: Joi.date().optional(),
    driverName: Joi.string().trim().optional(),
    driverIdentity: Joi.number().min(1).optional(),
    accidentDescription: Joi.string().trim().optional(),
    expectedCost: Joi.number().optional(),
    note: Joi.any().optional(),
    services: Joi.array().items(ServiceAccident).optional(),
    regionId: Joi.number().optional(),
    customerId: Joi.number().optional(),
    agentId: Joi.string().optional(),
    carId: Joi.number().optional(),
  }),
  accidentId: Joi.any().required(),
  list: Joi.object().keys({
    accidentID: Joi.number().optional(),
    carNumber: Joi.number().optional(),
    accidentPlace: Joi.string().trim().optional(),
    accidentDate: Joi.date().optional(),
    registerAccidentDate: Joi.date().optional(),
    driverName: Joi.string().trim().optional(),
    driverIdentity: Joi.number().min(1).optional(),
    regionId: Joi.number().optional(),
    customerID: Joi.string().optional(),
    agentID: Joi.string().optional(),
    carID: Joi.number().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = accidentSchema;