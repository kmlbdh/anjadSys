const validation = require("../middleware.validation");
const agentSchema  = require("../../schema/admin/schema.validation.admin.agents");

const agentValidation = {
  add: validation(agentSchema.add, 'body'),
  agentLimitID: validation(agentSchema.agentLimitID, 'param'),
  list: validation(agentSchema.list, 'body'),
 };

 module.exports = agentValidation;