const validation = require("../middleware.validation");
const supplierSchema = require("../../schema/admin/schema.validation.admin.suppliers");

const supplierValidation = {
  create: validation(supplierSchema.create, 'body'),
  listAccount: validation(supplierSchema.list, 'body'),
};

module.exports = supplierValidation;
