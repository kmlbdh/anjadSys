const accountRoute = require("express").Router();

const { accountValidation } = require("../../middleware/middleware.admin");
const accountController = require("../../controller/admin/controller.admin.accounts");

accountRoute.post("/list",[
  accountValidation.list,
], accountController.list);

module.exports = accountRoute;