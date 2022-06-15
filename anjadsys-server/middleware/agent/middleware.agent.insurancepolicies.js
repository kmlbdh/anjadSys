const validation = require("../middleware.validation");
const { insurancePolicySchema } = require("../../schema/schema.validation.agent");

const insurancePolicyValidation = {
  add: validation(insurancePolicySchema.add, 'body'),
  list: validation(insurancePolicySchema.list, 'body'),
 };

module.exports = insurancePolicyValidation;