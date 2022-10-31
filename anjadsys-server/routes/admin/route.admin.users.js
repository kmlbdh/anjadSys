
const userRoute = require("express").Router();

const userValidation = require('../../middleware/admin/middleware.admin.users');
const { checkDuplicateUsernameOrNickname } = require("../../middleware/middleware.shared");
const  userController = require("../../controller/admin/controller.admin.users");

userRoute.post("/create",[
  userValidation.create,
  checkDuplicateUsernameOrNickname
], userController.create);

userRoute.route("/:userID")
  .all(userValidation.userID)
  .delete(userController.delete)
  .put([
    userValidation.update,
  ], userController.update);

userRoute.route("/list*")
.all(userValidation.list);

userRoute.post("/list", userController.list);

userRoute.post("/list-light", userController.lightList);

module.exports = userRoute;