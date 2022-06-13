const { verifyLogin } = require("../middleware/middleware.shared");
const { sharedController } = require("../controller");

let Router = require('express').Router();

Router.post("", verifyLogin, sharedController.loginActions.login);

module.exports = Router;