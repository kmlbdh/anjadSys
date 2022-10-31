const validation = require("../middleware.validation");
const insurancePolicySchema = require("../../schema/admin/schema.validation.admin.insurancepolicies");

const insurancePolicyValidation = {
  add: validation(insurancePolicySchema.add, 'body'),
  update: validation(insurancePolicySchema.update, 'body'),
  insurancePolicyId: validation(insurancePolicySchema.insurancePolicyId, 'param'),
  list: validation(insurancePolicySchema.list, 'body'),
};

module.exports = insurancePolicyValidation;