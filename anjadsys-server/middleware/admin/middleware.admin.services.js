const validation = require("../middleware.validation");
const serviceSchema = require("../../schema/admin/schema.validation.admin.services");

const serviceValidation = {
  add: validation(serviceSchema.add, 'body'),
  serviceID: validation(serviceSchema.serviceID, 'param'),
  update: validation(serviceSchema.update, 'body'),
  list: validation(serviceSchema.list, 'body'),
};

module.exports = serviceValidation;