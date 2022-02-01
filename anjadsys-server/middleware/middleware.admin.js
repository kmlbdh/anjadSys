const validation = require("./middleware.validation");
const { 
  userSchema,
  serviceSchema,
  agentLimitsSchema,
  createSupplier,
  carSchema,
  carTypeSchema,
  carModelSchema,
} = require("../schema/schema.validation.admin");

const userValidation = {
  create: validation(userSchema.create, 'body'),
  update: validation(userSchema.update, 'body'),
  list: validation(userSchema.list, 'body'),
  delete: validation(userSchema.delete, 'body'),
};

const serviceValidation = {
   add: validation(serviceSchema.add, 'body'),
   delete: validation(serviceSchema.delete, 'body'),
   update: validation(serviceSchema.update, 'body'),
   list: validation(serviceSchema.list, 'body'),
};

const agentLimitsValidation = {
 add: validation(agentLimitsSchema.add, 'body'),
 delete: validation(agentLimitsSchema.delete, 'body'),
 list: validation(agentLimitsSchema.list, 'body'),
};

const carTypeValidation = {
 add: validation(carTypeSchema.add, 'body'),
 update: validation(carTypeSchema.update, 'body'),
 delete: validation(carTypeSchema.delete, 'body'),
 list: validation(carTypeSchema.list, 'body'),
};

const carModelValidation = {
 add: validation(carModelSchema.add, 'body'),
 update: validation(carModelSchema.update, 'body'),
 delete: validation(carModelSchema.delete, 'body'),
 list: validation(carModelSchema.list, 'body'),
};

const carValidation = {
 add: validation(carSchema.add, 'body'),
 update: validation(carSchema.update, 'body'),
 delete: validation(carSchema.delete, 'body'),
 list: validation(carSchema.list, 'body'),
};

const validateAddSupplier = validation(createSupplier, 'body');


module.exports = { 
  userValidation,
  serviceValidation,
  validateAddSupplier,
  agentLimitsValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
};