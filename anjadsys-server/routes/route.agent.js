const { 
  verifyLoggedIn,
  userValidation,
  serviceValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation,
  notBlockedUser,
 } = require("../middleware/middleware.agent");

const { 
  auth,
  checkDuplicateUsernameOrNickname 
} = require("../middleware/middleware.shared");

const {
  userActions,
  serviceActions,
  accidentActions,
  carTypeActions,
  carModelActions,
  carActions,
  regionActions,
  insurancePolicyActions,
  accountActions,
  statisticsActions
} = require("../controller/controller.agent");

const express = require('express');

Router = express.Router();
generalRoute = express.Router();
userRoute = express.Router();
serviceRoute = express.Router();
carTypeRoute = express.Router();
carModelRoute = express.Router();
carRoute = express.Router();
accidentRoute = express.Router();
insurancePolicyRoute = express.Router();
accountRoute = express.Router();

  Router.all("*", [auth.verifyToken, auth.isAgent]);
/** #################### USER  ########################*/

  userRoute.post("/create",[
    userValidation.create,
    checkDuplicateUsernameOrNickname
  ], userActions.create);

  userRoute.post("/list",[
    userValidation.list,
  ], userActions.list);

  userRoute.post("/list-active",[
    userValidation.list,
    notBlockedUser
  ], userActions.list);

  userRoute.post("/list-light",[
    userValidation.list,
  ], userActions.lightList);

  userRoute.post("/list-suppliers",[
    userValidation.listSuppliers,
  ], userActions.listSuppliers);

  Router.use("/user", userRoute);
    
/** #################### SERVICE  ########################*/

  serviceRoute.post("/list",[
    serviceValidation.list,
  ], serviceActions.list);

  Router.use("/service", serviceRoute);

/** #################### GENERAL API ########################*/

  generalRoute.get("/regions", regionActions.list);
  generalRoute.get("/statistics", statisticsActions.list);
  Router.use("/general", generalRoute);

/** #################### CAR TYPE ########################*/

  carTypeRoute.post("/list",[
    carTypeValidation.list,
  ], carTypeActions.list);

  Router.use("/car-type", carTypeRoute);

/** #################### CAR MODEL ########################*/

  carModelRoute.post("/list",[
    carModelValidation.list,
  ], carModelActions.list);

  Router.use("/car-model", carModelRoute);

/** #################### CAR ########################*/
  carRoute.post("/add",[
    carValidation.add
  ], carActions.add);

  carRoute.post("/list",[
    carValidation.list,
  ], carActions.list);

  Router.use("/car", carRoute);

/** #################### ACCIDENT ########################*/
  accidentRoute.post("/add",[
    accidentValidation.add
  ], accidentActions.add);

  accidentRoute.post("/list",[
    accidentValidation.list,
  ], accidentActions.list); 

  Router.use("/accident", accidentRoute);

/** #################### INSURANCE POLICY ########################*/
  insurancePolicyRoute.post("/add",[
    insurancePolicyValidation.add
  ], insurancePolicyActions.add);

  insurancePolicyRoute.post("/list",[
    insurancePolicyValidation.list,
  ], insurancePolicyActions.list);

  Router.use("/insurance-policy", insurancePolicyRoute);

/** #################### ACCOUNT  ########################*/
  accountRoute.post("/list",[
    accountValidation.list,
  ], accountActions.list);

  Router.use("/account", accountRoute);
// };

module.exports = Router;