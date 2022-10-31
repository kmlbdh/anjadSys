const adminController = {
  userActions: require('./admin/controller.admin.users'),
  serviceActions: require('./admin/controller.admin.services'),
  otherServiceActions: require('./admin/controller.admin.otherservices'),
  agentActions: require('./admin/controller.admin.agents'),
  sharedActions: require('./admin/controller.admin.shared'),
  accidentActions: require('./admin/controller.admin.accidents'),
  carTypeActions: require('./admin/controller.admin.cartypes'),
  carModelActions: require('./admin/controller.admin.carmodels'),
  carActions: require('./admin/controller.admin.cars'),
  insurancePolicyActions: require('./admin/controller.admin.insurancepolicies'),
  accountActions: require('./admin/controller.admin.accounts'),
  SupplierActions: require('./admin/controller.admin.suppliers'),
};

const agentController = {
  userActions: require('./agent/controller.agent.users'),
  sharedActions: require('./agent/controller.agent.shared'),
  serviceActions: require('./agent/controller.agent.services'),
  carActions: require('./agent/controller.agent.cars'),
  carModelActions: require('./agent/controller.agent.carmodels'),
  carTypeActions: require('./agent/controller.agent.cartypes'),
  accidentActions: require('./agent/controller.agent.accidents'),
  insurancePolicyActions: require('./agent/controller.agent.insurancepolicies'),
  accountActions: require('./agent/controller.agent.accounts'),
};

const sharedController = {
  userActions: require('./shared/controller.shared.users'),
  serviceActions: require('./shared/controller.shared.services'),
  loginActions: require('./shared/controller.shared.login')
}

module.exports = { adminController, agentController, sharedController };