const validation = require("../middleware.validation");
const { agentLimitsSchema } = require("../../schema/schema.validation.admin");

const agentValidation = {
  add: validation(agentLimitsSchema.add, 'body'),
  agentLimitID: validation(agentLimitsSchema.agentLimitID, 'param'),
  list: validation(agentLimitsSchema.list, 'body'),
 };

 module.exports = agentValidation;