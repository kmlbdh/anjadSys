const validation = require("../middleware.validation");
const accidentSchema = require("../../schema/agent/schema.validation.agent.accidents");

const accidentValidation = {
  add: validation(accidentSchema.add, 'body'),
  list: validation(accidentSchema.list, 'body'),
};

module.exports = accidentValidation;
 