const validation = require("../middleware.validation");
const carModelSchema = require("../../schema/agent/schema.validation.agent.carmodels");

const carModelValidation = {
  list: validation(carModelSchema.list, 'body'),
};

module.exports = carModelValidation;