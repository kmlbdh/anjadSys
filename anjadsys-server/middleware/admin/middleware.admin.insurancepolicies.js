const validation = require("../middleware.validation");
const { insurancePolicySchema } = require("../../schema/schema.validation.admin");

const insurancePolicyValidation = {
  add: validation(insurancePolicySchema.add, 'body'),
  update: validation(insurancePolicySchema.update, 'body'),
  insurancePolicyId: validation(insurancePolicySchema.insurancePolicyId, 'param'),
  list: validation(insurancePolicySchema.list, 'body'),
};

module.exports = insurancePolicyValidation;