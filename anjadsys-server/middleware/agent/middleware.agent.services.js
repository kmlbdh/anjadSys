const validation = require("../middleware.validation");
const { serviceSchema } = require("../../schema/schema.validation.agent");

const serviceValidation = {
  list: validation(serviceSchema.list, 'body'),
};

module.exports = serviceValidation;