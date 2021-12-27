const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const { createUser: sharedCreateUser, listUsers: sharedListUsers } = require("./controller.shared");

const User = db.userModel;
const Role = db.roleModel;
// const Service = db.serviceModel;
const agentLimits = db.agentLimitsModel;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.agent-ListUsers");
const createUserLog = util.debuglog("controller.agent-CreateUser");
const listServicesLog = util.debuglog("controller.agent-ListServices");
const addServiceToCustomerLog = util.debuglog("controller.agent-addServiceToCustomer");

const listUsers = async(req, res) => {
  const role = await Role.findOne({name: 'customer'}).exec();
  const limit = req.body.limit ? req.body.limit : 20;
  const skip = req.body.skip ? req.body.skip : 0;

  if(!req.agent || !role)
    throw new customError("Unauthorized!", INTERR);

  const query = {'role': role.name, 'agent.agentID': req.agent._id};
  // if (req.agent.nickname) query = {...query,  'agent.agentNickname': req.agent.nickname};
  if (req.body.userID) query._id = req.body.userID;

  listUsersLog(role);
  await sharedListUsers(res, query, skip, limit);
};

const createUser = async (req, res) => {
  try {
    let {username, nickname, password, phone, tel, note} = req.body;
    const agent = {
      agentID: req.agent._id,
      agentNickname: req.agent.nickname
    };
    const roleDB = await Role.findOne({name: {$eq: 'customer'}}).exec();
    createUserLog(agent);
    await sharedCreateUser(res, {username, nickname, password, phone, tel, note, role: roleDB.name, agent});
  } catch(error) {
    createUserLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! User wasn't registered!";
    res.json({message: messageOfCustomError });
  }
};

//TODO same function in admin, if haven't more requirements in both need to move to shared controller
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

const addServiceToCustomer = async(req, res) => {
  try{
    const { userID, serviceName, serviceID, price, period, startDate, endDate} = req.body;
  
    let objAgentLimits = (await agentLimits.findOne({agentID: req.agent._id}, {}, {sort: {'created_at': -1}}))
      .toObject();
    addServiceToCustomerLog(objAgentLimits);

    const limit = parseInt(objAgentLimits.totalMoney) - parseInt(price);
    addServiceToCustomerLog(limit);
    if(limit < 0)
      throw new customError("you don't have enough money", INTERR);
    
    objAgentLimits.totalMoney = limit;
    objAgentLimits._id = undefined;
    objAgentLimits.service = {
      serviceID,
      userID,
      cost: price
    };
    let newAgentLimits = new agentLimits(objAgentLimits)
    newAgentLimits.isNew = true;
  
    const saveAgentLimit = await newAgentLimits.save();
    if(!saveAgentLimit) throw new customError("Failed! can't add service to the customer", INTERR);

    const query = {_id: userID, 'agent.agentID': req.agent._id};
    const serviceUpdate = {
      serviceID,
      serviceName,
      price,
      period,
      startDate,
      endDate
    };
    addServiceToCustomerLog(query);
    const {lastErrorObject:{ updatedExisting }} = await User.findOneAndUpdate(query, 
      {
        $addToSet: {"services": serviceUpdate}
      }, {rawResult: true });
    addServiceToCustomerLog(updatedExisting);

    if(!updatedExisting)
      throw new customError("Failed! service is not add!", INTERR);

    res.status(200).json({message: "service is added to the customer!"});
  } catch(error) {
    addServiceToCustomerLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! service is not add!";
    res.json({message: messageOfCustomError });
  }
};

module.exports = {
  listUsers,
  createUser,
  listServices,
  addServiceToCustomer
};