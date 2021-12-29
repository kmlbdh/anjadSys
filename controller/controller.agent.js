const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const { 
  createUser: sharedCreateUser,
  listUsers: sharedListUsers,
  deleteUser: sharedDeleteUser,
} = require("./controller.shared");

const User = db.userModel;
const Role = db.roleModel;
const mongoose = db.mongoose;
// const Service = db.serviceModel;
const agentLimits = db.agentLimitsModel;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.agent-ListUsers");
const createUserLog = util.debuglog("controller.agent-CreateUser");
const listServicesLog = util.debuglog("controller.agent-ListServices");
const addServiceToCustomerLog = util.debuglog("controller.agent-addServiceToCustomer");
const checkAgentLimitsLog = util.debuglog("controller.agent-checkAgentLimits");
const addServiceToCustDocLog = util.debuglog("controller.agent-addServiceToCustDocs");

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
    let {username, nickname, address, password, phone, tel, note} = req.body;
    const agent = {
      agentID: req.agent._id,
      agentNickname: req.agent.nickname
    };
    const roleDB = await Role.findOne({name: 'customer'}).exec();
    createUserLog(agent);
    await sharedCreateUser(res, {username, nickname, address, password, phone, tel, note, role: roleDB.name, agent});
  } catch(error) {
    createUserLog(error);
    errorHandler(res, error, "Failed! User wasn't registered!");
  }
};

const deleteUser = async(req, res) => {
  let {username} = req.body;
  query = {_id: username, agentID: req.agent._id};

  await sharedDeleteUser(res, query);
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
  // Using Mongoose's default connection
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    const { userID, serviceID, price: reqPrice, dailyCost, additionalDays, period} = req.body;
    //Equation
    const finalPrice = (dailyCost && additionalDays) ? (reqPrice + (dailyCost * additionalDays)) : reqPrice;
    const finalPeriod = (dailyCost && additionalDays) ? (period + additionalDays) : period;
    const agentID = req.agent._id;

    const newLimit = await checkAgentLimits(agentID, session, finalPrice);

    const newCustomerServiceID = await addServiceToCustDoc(req, finalPrice, finalPeriod, session);

    let newAgentLimits = new agentLimits({
      totalMoney: newLimit,
      agentID,
      service: {
        serviceID,
        userID,
        cost: finalPrice,
        customerServiceID: newCustomerServiceID
      }
    });

    addServiceToCustomerLog(newAgentLimits);
    const saveAgentLimit = await newAgentLimits.save();
    if(!saveAgentLimit) throw new customError("Failed! can't add service to the customer", INTERR);

    await session.commitTransaction();
    res.status(200).json({message: "service is added to the customer!"});
  } catch(error) {
    await session.abortTransaction();
    addServiceToCustomerLog(error);
    errorHandler(res, error, "Failed! service is not add!");
  }
};

//Part of addServiceToCustomer function
const checkAgentLimits = async(agentId, session, finalPrice) => {

  let objAgentLimits = await agentLimits.findOne({agentID: agentId}, null, {sort: {'created_at': -1}})
    .session(session).exec();
  checkAgentLimitsLog(objAgentLimits);
  if(!objAgentLimits)
    throw new customError("you don't money in your limits, please ask adminitrator to add money limits for you", INTERR);
  
  objAgentLimits = objAgentLimits.toObject();
  const limit = parseInt(objAgentLimits.totalMoney) - parseInt(finalPrice);
  checkAgentLimitsLog(limit);
  if(limit < 0)
    throw new customError("you don't have enough money", INTERR);

  return limit;
};

//Part of addServiceToCustomer function
const addServiceToCustDoc = async(req, finalPrice, finalPeriod, session) => {
  const { userID, serviceName, serviceID, dailyCost, additionalDays, startDate, endDate} = req.body;

  const query = {_id: userID, 'agent.agentID': req.agent._id};
  const serviceUpdate = {
    serviceID,
    serviceName,
    price: finalPrice,
    period: finalPeriod,
    startDate,
    endDate,
    additionalDays,
    dailyCost
  };
  addServiceToCustDocLog(query);

  const {value: {services}, lastErrorObject} = await User.findOneAndUpdate(query, 
    {
      $addToSet: {"services": serviceUpdate}
    }, {
      new: true,
      rawResult: true,
      session: session
      });

  if(!lastErrorObject.updatedExisting || lastErrorObject.n !== 1) 
    throw new customError("Failed! service is not add to user!", INTERR);
  
  return services[services.length - 1]._id;
};

module.exports = {
  listUsers,
  createUser,
  deleteUser,
  listServices,
  addServiceToCustomer
};