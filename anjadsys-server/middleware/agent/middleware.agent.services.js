const validation = require("../middleware.validation");
const serviceSchema = require("../../schema/agent/schema.validation.agent.services");

const serviceValidation = {
  list: validation(serviceSchema.list, 'body'),
};

module.exports = serviceValidation;