const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateCreateUser = validation(schema.createUserForAgent, 'body');
const validateListUsers = validation(schema.listUsersForAgent, 'body');
const validateListServices = validation(schema.listServicesForAdmin, 'body');
const validateAddServiceToCustomer = validation(schema.addServiceToCustomerOfAgent, 'body');
const validateDeleteServiceToCustomer = validation(schema.deleteServiceToCustomerOfAgent, 'body');
const validateDeleteUser = validation(schema.deleteUserForAgent, 'body');

module.exports = { 
  validateCreateUser,
  validateListUsers,
  validateDeleteUser,
  validateListServices,
  validateAddServiceToCustomer,
  validateDeleteServiceToCustomer
};