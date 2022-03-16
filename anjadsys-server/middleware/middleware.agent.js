const validation = require("./middleware.validation");
const { 
  userSchema,
  serviceSchema,
  carSchema,
  carTypeSchema,
  carModelSchema,
  accidentSchema,
  insurancePolicySchema,
  accountSchema,
} = require("../schema/schema.validation.agent");
const req = require("express/lib/request");


const userValidation = {
  create: validation(userSchema.create, 'body'),
  update: validation(userSchema.update, 'body'),
  list: validation(userSchema.list, 'body'),
  listSuppliers: validation(userSchema.listSuppliers, 'body'),
  delete: validation(userSchema.delete, 'body'),
};

const serviceValidation = {
   list: validation(serviceSchema.list, 'body'),
};

const carTypeValidation = {
 list: validation(carTypeSchema.list, 'body'),
};

const carModelValidation = {
 list: validation(carModelSchema.list, 'body'),
};

const carValidation = {
 add: validation(carSchema.add, 'body'),
 list: validation(carSchema.list, 'body'),
};

const accidentValidation = {
 add: validation(accidentSchema.add, 'body'),
 list: validation(accidentSchema.list, 'body'),
};

const accountValidation = {
   list: validation(accountSchema.list, 'body'),
};

const insurancePolicyValidation = {
 add: validation(insurancePolicySchema.add, 'body'),
 list: validation(insurancePolicySchema.list, 'body'),
};

const notBlockedUser = (req, res, next) => {
  req.body.blocked = false;
  next();
}
module.exports = { 
  userValidation,
  serviceValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation,
  notBlockedUser
};