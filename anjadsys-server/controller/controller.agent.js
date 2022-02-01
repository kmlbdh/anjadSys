const db = require("../models");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const { 
  createUser: sharedCreateUser,
  listUsers: sharedListUsers,
  deleteUser: sharedDeleteUser,
} = require("./controller.shared");

const User = db.User;
const Role = db.Role;
const Account = db.Account;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.agent-ListUsers");
const createUserLog = util.debuglog("controller.agent-CreateUser");
const listServicesLog = util.debuglog("controller.agent-ListServices");
const addServiceToCustomerLog = util.debuglog("controller.agent-AddServiceToCustomer");
const checkAgentLimitsLog = util.debuglog("controller.agent-CheckAgentLimits");
const addServiceToCustDocLog = util.debuglog("controller.agent-AddServiceToCustDocs");
const deletedServiceToCustomerLog = util.debuglog("controller.agent-deletedServiceToCustomer");

const listUsers = async(req, res) => {
  try{
    const roleDB = await Role.findOne({where: {name: 'customer'}});
    const limit = req.body.limit;
    const skip = req.body.skip;
  
    if(!roleDB)
      throw new customError("Failed! can't find specified role!", INTERR);

    const query = {where: { roleId: roleDB.id, agentId: req.agent.id }};
    
    if (req.body.userID) query.where.id = req.body.userID;
  
    listUsersLog(roleDB);
    await sharedListUsers(res, query, skip, limit);
  } catch(error){
    createUserLog(error);
    errorHandler(res, error, "Failed! User wasn't registered!");
  }
};

const createUser = async (req, res) => {
  try {
    let {username, nickname, address, password, phone, tel, note} = req.body;

    const agent = {
      agentID: req.agent._id,
      agentNickname: req.agent.nickname
    };
    const roleDB = await Role.findOne({name: 'customer'}).exec();
    if(!roleDB)
      throw new customError("Failed! can't find specified role!", INTERR);

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
  listServicesLog(req.body.agentID);
  let query = {};
  const limit = req.body.limit ? req.body.limit : 20;
  const skip = req.body.skip ? req.body.skip : 0;
  if (req.body.serviceName) query.name = req.body.serviceName;

  listServicesLog(query);
  await sharedlistServices(res, query, skip, limit);
};

const addServiceToCustomer = async(req, res) => {
  // Using Mongoose's default connection
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    let { userID, serviceID, price: reqPrice, dailyCost, additionalDays, period} = req.body;
    //Equation
    //Casting
    additionalDays = parseInt(additionalDays);
    period = parseInt(period);
    dailyCost = parseInt(dailyCost);
    reqPrice = parseInt(reqPrice);

    const finalPrice = (dailyCost && additionalDays) ? (reqPrice + (dailyCost * additionalDays)) : reqPrice;
    const finalPeriod = (dailyCost && additionalDays) ? (period + additionalDays) : period;
    const agentID = req.agent._id;

    const newLimit = await checkAgentLimits(agentID, session, finalPrice);

    const newCustomerService = await addServiceToCustDoc(req, finalPrice, finalPeriod, session);

    let newAgentLimits = new agentLimits({
      totalMoney: newLimit,
      agentID,
      service: {
        serviceID,
        userID,
        cost: finalPrice,
        customerServiceID: newCustomerService._id
      }
    });

    addServiceToCustomerLog(newAgentLimits);
    const saveAgentLimit = await newAgentLimits.save();
    if(!saveAgentLimit)
      throw new customError("Failed! can't add service to the customer", INTERR);

    await session.commitTransaction();
    res.status(200).json({message: "service is added to the customer!", data:{customerService: newCustomerService, agentLimit: saveAgentLimit}});
  } catch(error) {
    await session.abortTransaction();
    addServiceToCustomerLog(error);
    errorHandler(res, error, "Failed! service isn't add to the customer!");
  }
};

const deleteServiceFromCustomer = async(req, res) => {
  // Using Mongoose's default connection
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const { customerServiceID } = req.body;
    const agentId = req.agent._id;

    const deletedAgentLimits = await agentLimits.findOneAndDelete({agentID: agentId, 'service.customerServiceID': customerServiceID})
    .session(session).exec();
    deletedServiceToCustomerLog(deletedAgentLimits);

    if(!deletedAgentLimits) 
      throw new customError("Failed! can't delete service from the customer - agent limits error", INTERR);
    let query = {
      _id: deletedAgentLimits.service.userID,
      'agent.agentID': agentId
    };
    deletedServiceToCustomerLog(query);
    const deletedUserService = await User.findOneAndUpdate(query, {
      $pull: {
        services: {
          _id: customerServiceID
        }
      }
    }, { new:true, rawResult: true }).session(session).exec();

    deletedServiceToCustomerLog(deletedUserService);

    if(deletedUserService.lastErrorObject.n !== 1 && !deletedUserService.lastErrorObject.updatedExisting) 
      throw new customError("Failed! can't delete service from the customer - user error", INTERR);

    await session.commitTransaction();
    res.status(200).json({
      message: "service is deleted from the customer!", 
      data: {userService: deletedUserService.services, agentLimits: deletedAgentLimits}
    });
  } catch(error) {
    await session.abortTransaction();
    deletedServiceToCustomerLog(error);
    errorHandler(res, error, "Failed! service is not deleted!");
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
  const limit = parseInt(objAgentLimits.totalMoney) - finalPrice;
  checkAgentLimitsLog(limit);

  if(limit < 0)
    throw new customError("you don't have enough money", INTERR);

  return limit;
};

//Part of addServiceToCustomer function
const addServiceToCustDoc = async(req, finalPrice, finalPeriod, session) => {
  const { userID, serviceName, serviceID, dailyCost, additionalDays, startDate, endDate } = req.body;

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
  
  return services[services.length - 1];
};

module.exports = {
  listUsers,
  createUser,
  deleteUser,
  listServices,
  addServiceToCustomer,
  deleteServiceFromCustomer
};