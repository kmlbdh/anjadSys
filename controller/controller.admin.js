const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const { 
  createUser: sharedCreateUser,
  listUsers: sharedListUsers,
  listServices: sharedlistServices,
  listAgentLimits: sharedListAgentLimits,
  } = require("./controller.shared");

const User = db.userModel;
const Role = db.roleModel;
const Service = db.serviceModel;
const AgentLimits = db.agentLimitsModel;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.admin-ListUsers");
const createUserLog = util.debuglog("controller.admin-CreateUser");
const addServiceLog = util.debuglog("controller.admin-AddService");
const listServicesLog = util.debuglog("controller.admin-ListServices");
const addAgentLimitsLog = util.debuglog("controller.admin-AddAgentLimits");
const listMainAgentLimitsLog = util.debuglog("controller.admin-listMainAgentLimits");

const listUsers = async(req, res) => {
  try {
    listUsersLog(req.body.agentID);
    let query = {};
    const limit = req.body.limit ? req.body.limit : 20;
    const skip = req.body.skip ? req.body.skip : 0;
    if (req.body.role) query.role = req.body.role;
    if (req.body.agentID){
      const agId = String(req.body.agentID);
      query = {...query, 'agent.agentID': agId};
    }
    if (req.body.nickname) query = {...query, 'agent.agentNickname': req.body.nickname};
    if (req.body.userID) query._id = req.body.userID;

    listUsersLog(query);
    await sharedListUsers(res, query, skip, limit);
  } catch(error) {
    listUsersLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! cant get Users!";
    res.json({message: messageOfCustomError });
  }
};

const createUser = async (req, res) => {
  try {
    let {username, nickname, password, phone, tel, note, role, agent:{agentID, agentNickname} = {}} = req.body;

    const agent = (!agentID || !agentNickname) ? undefined : {agentID, agentNickname};
    const roleDB = await Role.findOne({name: {$eq: role}}).exec();
    if(!roleDB)
      throw new customError("Failed! Role not exist!", INTERR);

    await sharedCreateUser(res, {username, nickname, password, phone, tel, note, role: roleDB.name, agent});
  } catch(error) {
    createUserLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! User wasn't registered!";
    res.json({message: messageOfCustomError });
  }
};

const addService = async(req, res) => {
  try {
    let {serviceName, coverageDays, cost, note} = req.body;
    const service = new Service({
      name: serviceName,
      coverDays: coverageDays,
      cost,
      note
    });
    await service.save();
    res.json({message: "Service was added successfully!"});
  } catch(error) {
    addServiceLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! service wasn't added!";
    res.json({message: messageOfCustomError });
  }
};

const listServices = async(req, res) => {
  try{
    listServicesLog(req.body.agentID);
    let query = {};
    const limit = req.body.limit ? req.body.limit : 20;
    const skip = req.body.skip ? req.body.skip : 0;
    if (req.body.serviceName) query.name = req.body.serviceName;

    listServicesLog(query);
    await sharedlistServices(res, query, skip, limit);

  } catch(error) {
    listServicesLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! can't get services!";
    res.json({message: messageOfCustomError });
  }
};

const addAgentLimits = async(req, res) => {
  try {
    let {limitAmount, agentID} = req.body;
    addAgentLimitsLog('here',req.body);
    const agentLimits = new AgentLimits({
      totalMoney: limitAmount,
      agentID
    });
    await agentLimits.save();
    res.json({message: "agent money limits was added successfully!"});
  } catch(error) {
    addServiceLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! agent money limits wasn't added!";
    res.json({message: messageOfCustomError });
  }
};

const listMainAgentLimits = async(req, res) => {
  try {
    listMainAgentLimitsLog(req.body);
    let query = {};
    const limit = req.body.limit ? req.body.limit : 20;
    const skip = req.body.skip ? req.body.skip : 0;
    if (req.body.agentID) query.agentID = req.body.agentID;
    query.services = { $exists: false };

    await sharedListAgentLimits(res, query, skip, limit);
  } catch(error) {
    listMainAgentLimitsLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! can't list agent limits!";
    res.json({message: messageOfCustomError });
  }
};

module.exports = {
  listUsers,
  createUser,
  addService,
  listServices,
  addAgentLimits,
  listMainAgentLimits
};