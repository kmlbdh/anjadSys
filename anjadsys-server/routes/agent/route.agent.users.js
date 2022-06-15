const userRoute = require('express').Router();

const { userValidation, notBlockedUser } = require("../../middleware/middleware.agent");
const { checkDuplicateUsernameOrNickname } = require("../../middleware/middleware.shared");
const userController  = require('../../controller/agent/controller.agent.users');

userRoute.post("/create",[
  userValidation.create,
  checkDuplicateUsernameOrNickname
], userController.create);

userRoute.post("/list",[
  userValidation.list,
], userController.list);

userRoute.post("/list-active",[
  userValidation.list,
  notBlockedUser
], userController.list);

userRoute.post("/list-light",[
  userValidation.list,
], userController.lightList);

userRoute.post("/list-suppliers",[
  userValidation.listSuppliers,
], userController.listSuppliers);

module.exports = userRoute;