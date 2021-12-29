const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateListUsers = validation(schema.listUsersForAgent, 'body');
const validateListServices = validation(schema.listServicesForAdmin, 'body');
const validateAddServiceToCustomer = validation(schema.addServiceToCustomerOfAgent, 'body');
const validateDeleteUser = validation(schema.deleteUserForAgent, 'body');

module.exports = { 
  validateListUsers,
  validateDeleteUser,
  validateListServices,
  validateAddServiceToCustomer
};