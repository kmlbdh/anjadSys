const validation = require("../middleware.validation");
const insurancePolicySchema = require("../../schema/agent/schema.validation.agent.insurancepolicies");

const insurancePolicyValidation = {
  add: validation(insurancePolicySchema.add, 'body'),
  list: validation(insurancePolicySchema.list, 'body'),
 };

module.exports = insurancePolicyValidation;