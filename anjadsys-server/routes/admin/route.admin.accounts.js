const accountRoute = require("express").Router();

const accountValidation = require('../../middleware/admin/middleware.admin.accounts');
const accountController = require("../../controller/admin/controller.admin.accounts");

accountRoute.post("/list",[
  accountValidation.list,
], accountController.list);

module.exports = accountRoute;