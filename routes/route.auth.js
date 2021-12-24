const { verifySingUp, verifySingIn } = require("../middleware");
const controller = require("../controller/controller.auth");

module.exports = function(app){
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/signup",[
    verifySingUp.validateSignup,
    verifySingUp.checkDuplicateUsernameOrNickname
  ], controller.signup);

  app.post("/api/signin", [verifySingIn.validateSignin], controller.signin);
};