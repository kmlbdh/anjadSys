const validation = require("../middleware.validation");
const userSchema = require("../../schema/agent/schema.validation.agent.users");

const userValidation = {
  create: validation(userSchema.create, 'body'),
  // update: validation(userSchema.update, 'body'),
  list: validation(userSchema.list, 'body'),
  listSuppliers: validation(userSchema.listSuppliers, 'body'),
};

const notBlockedUser = (req, res, next) => {
  req.body.blocked = false;
  next();
}

module.exports = { userValidation, notBlockedUser };