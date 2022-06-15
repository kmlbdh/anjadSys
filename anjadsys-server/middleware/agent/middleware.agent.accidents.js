const validation = require("../middleware.validation");
const { accidentSchema } = require("../../schema/schema.validation.agent");

const accidentValidation = {
  add: validation(accidentSchema.add, 'body'),
  list: validation(accidentSchema.list, 'body'),
};

module.exports = accidentValidation;
 