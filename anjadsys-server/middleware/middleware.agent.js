const validation = require("./middleware.validation");
const { userSchema, serviceSchema } = require("../schema/schema.validation.agent");

const userValidation = {
 create: validation(userSchema.create, 'body'),
 list: validation(userSchema.list, 'body'),
 delete: validation(userSchema.delete, 'body'),
};

const validateListServices = validation(serviceSchema.list, 'body');

module.exports = { 
  userValidation,
  validateListServices
};