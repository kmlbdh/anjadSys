const supplierRoute = require("express").Router();

const { supplierValidation } = require("../../middleware/middleware.admin");
const { checkDuplicateUsernameOrNickname } = require("../../middleware/middleware.shared");
const supplierController = require("../../controller/admin/controller.admin.suppliers");
const  userController = require("../../controller/admin/controller.admin.users");

supplierRoute.post("/create",[
  supplierValidation.create,
  checkDuplicateUsernameOrNickname
], userController.create);

supplierRoute.post("/account",[
  supplierValidation.listAccount,
], supplierController.list);

module.exports = supplierRoute;