const validation = require("../middleware.validation");
const carSchema = require("../../schema/agent/schema.validation.agent.cars");

const carValidation = {
  add: validation(carSchema.add, 'body'),
  list: validation(carSchema.list, 'body'),
};

module.exports = carValidation;