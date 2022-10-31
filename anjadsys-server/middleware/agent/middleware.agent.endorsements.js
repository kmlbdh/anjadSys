const validation = require("../middleware.validation");
const endorsementSchema = require("../../schema/agent/schema.validation.agent.endorsements");

const endorsementValidation = {
  add: validation(endorsementSchema.add, 'body'),
  list: validation(endorsementSchema.list, 'body'),
};

module.exports = endorsementValidation;