const validation = require("../middleware.validation");
const userSchema = require("../../schema/admin/schema.validation.admin.users");

const userValidation = {
  create: validation(userSchema.create, 'body'),
  userID: validation(userSchema.userID, 'param'),
  update: validation(userSchema.update, 'body'),
  list: validation(userSchema.list, 'body'),
};

module.exports = userValidation;