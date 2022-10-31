const { auth, verifyLoginValidation } = require("../middleware/middleware.shared");
const loginController = require("../controller/shared/controller.shared.login");

const adminRouter = require('express').Router();
const agentRouter = require('express').Router();
const loginRouter = require('express').Router();

adminRouter
  .all('*', [ auth.verifyToken, auth.isAdmin ])
  .use('/user', require('./admin/route.admin.users'))
  .use('/supplier', require('./admin/route.admin.suppliers'))
  .use('/service', require('./admin/route.admin.services'))
  .use('/other-service', require('./admin/route.admin.otherservices'))
  .use('/agent-limits', require('./admin/route.admin.agents'))
  .use('/general', require('./admin/route.admin.shared'))
  .use('/car-type', require('./admin/route.admin.cartypes'))
  .use('/car-model', require('./admin/route.admin.carmodels'))
  .use('/car', require('./admin/route.admin.cars'))
  .use('/accident', require('./admin/route.admin.accidents'))
  .use('/insurance-policy', require('./admin/route.admin.insurancepolicies'))
  .use('/endorsement', require('./admin/route.admin.endorsements'))
  .use('/account', require('./admin/route.admin.accounts'));

agentRouter
  .all("*", [auth.verifyToken, auth.isAgent])
  .use("/user", require('./agent/route.agent.users'))
  .use("/service", require('./agent/route.agent.services'))
  .use("/general", require('./agent/route.agent.shared'))
  .use("/car-type", require('./agent/route.agent.cartypes'))
  .use("/car-model", require('./agent/route.agent.carmodels'))
  .use("/car", require('./agent/route.agent.cars'))
  .use("/accident", require('./agent/route.agent.accidents'))
  .use("/insurance-policy", require('./agent/route.agent.insurancepolicies'))
  .use("/account", require('./agent/route.agent.accounts'))
  .use("/endorsement", require('./agent/route.agent.endorsements'));

loginRouter
    .post("", verifyLoginValidation, loginController.login);

module.exports = { adminRouter, agentRouter, loginRouter };
