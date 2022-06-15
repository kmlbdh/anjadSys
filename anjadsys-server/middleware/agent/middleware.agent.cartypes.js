const validation = require("../middleware.validation");
const carTypeSchema = require("../../schema/agent/schema.validation.agent.cartypes");

const carTypeValidation = {
  list: validation(carTypeSchema.list, 'body'),
 };

module.exports = carTypeValidation;