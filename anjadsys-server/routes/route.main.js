const { verifyLogin } = require("../middleware/middleware.shared");
const { login } = require("../controller/controller.shared");

let Router = require('express').Router();

Router.post("", verifyLogin, login);

module.exports = Router;