const { auth } = require("../middleware");
const controller = require("../controller/controller.admin");

module.exports = function(app){
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/admin/all-users",[
    auth.verifyToken,
    auth.isAdmin,
    auth.validateListUsersByRole
  ], controller.listUsers);

};