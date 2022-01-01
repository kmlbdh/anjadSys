const { verifyLogin } = require("../middleware/middleware.shared");
const { login } = require("../controller/controller.shared");

module.exports = function(app){
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/login", verifyLogin.validateLogin, login);
};