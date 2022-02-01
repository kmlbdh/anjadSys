const {
  userValidation,
  validateListServices,
} = require("../middleware/middleware.agent");
const { auth, checkDuplicateUsernameOrNickname } = require("../middleware/middleware.shared");
const controller = require("../controller/controller.agent");

module.exports = function(app){
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/agent/list-users",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.list
  ], controller.listUsers);

  app.post("/api/agent/create-user",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.create,
    checkDuplicateUsernameOrNickname
  ], controller.createUser);

  app.post("/api/agent/delete-user",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.delete
  ], controller.deleteUser);

  app.post("/api/agent/list-services",[
    auth.verifyToken,
    auth.isAgent,
    validateListServices,
  ], controller.listServices);

  // app.post("/api/agent/add-customer-service",[
  //   auth.verifyToken,
  //   auth.isAgent,
  //   validateAddServiceToCustomer,
  // ], controller.addServiceToCustomer);

  // app.post("/api/agent/delete-customer-service",[
  //   auth.verifyToken,
  //   auth.isAgent,
  //   validateDeleteServiceToCustomer,
  // ], controller.deleteServiceFromCustomer);
};