const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const { 
  createUser: sharedCreateUser,
  listUsers: sharedListUsers,
  listServices: sharedlistServices,
  listAgentLimits: sharedListAgentLimits,
  deleteUser: sharedDeleteUser,
  } = require("./controller.shared");

const User = db.userModel;
const Role = db.roleModel;
const Service = db.serviceModel;
const AgentLimits = db.agentLimitsModel;
const SupplierParts = db.supplierPartsModel;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.admin-ListUsers");
const createUserLog = util.debuglog("controller.admin-CreateUser");
const addServiceLog = util.debuglog("controller.admin-AddService");
const deleteServiceLog = util.debuglog("controller.admin-DeleteService");
const listServicesLog = util.debuglog("controller.admin-ListServices");
const addAgentLimitsLog = util.debuglog("controller.admin-AddAgentLimits");
const deleteAgentLimitsLog = util.debuglog("controller.admin-DeleteAgentLimits");
const listMainAgentLimitsLog = util.debuglog("controller.admin-listMainAgentLimits");
const addSupplierPartsLog = util.debuglog("controller.admin-addSupplierParts");
const deleteSupplierPartsLog = util.debuglog("controller.admin-deleteSupplierParts");
const listSupplierPartsLog = util.debuglog("controller.admin-ListSupplierParts");

const createUser = async (req, res) => {
  try {
    let {username, nickname, password, address, phone, tel, note, role, agent:{agentID, agentNickname} = {}} = req.body;

    const agent = (!agentID || !agentNickname) ? undefined : {agentID, agentNickname};
    const roleDB = await Role.findOne({name: {$eq: role}}).exec();
    if(!roleDB)
      throw new customError("Failed! Role not exist!", INTERR);

    await sharedCreateUser(res, {username, nickname, address, password, phone, tel, note, role: roleDB.name, agent});
  } catch(error) {
    createUserLog(error);
    errorHandler(res, error, "Failed! User wasn't registered!")
  }
};

const createSupplier = async (req, res) => {
  try {
    let {username, nickname, address, phone, tel, note} = req.body;

    const roleDB = await Role.findOne({ name: 'supplier'}).exec();
    if(!roleDB)
      throw new customError("Failed! Role not exist!", INTERR);

    await sharedCreateUser(res, 
      {username, nickname, address, undefined, phone, tel, note, role: roleDB.name, undefined});
  } catch(error) {
    createUserLog(error);
    errorHandler(res, error, "Failed! Supplier wasn't registered!");
  }
};

const deleteUser = async(req, res) => {
  let {username} = req.body;
  query = {_id: username};

  await sharedDeleteUser(res, query);
};

const addSupplierParts = async(req, res) => {
  try {
    let {partNo, partName, quantity, cost, supplierID} = req.body;
    const supplierParts = new SupplierParts({
      partNo,
      partName,
      quantity,
      cost,
      supplierID
    });
    const savedSupplierParts = await supplierParts.save();
    if(!savedSupplierParts)
      throw new customError("Failed! supplier part wasn't added!", INTERR);

    res.status(200).json({message: "supplier part was added successfully!", data: savedSupplierParts});
  } catch(error) {
    addSupplierPartsLog(error);
    errorHandler(res, error, "Failed! supplier part wasn't added!");
  }
};

const deleteSupplierParts = async(req, res) => {
  try{
    let {supplierPartsID} = req.body;
    const supplierParts = await SupplierParts.findOneAndDelete({_id: supplierPartsID}).exec();
    if(!supplierParts)
      throw new customError("Failed! part of the supplier wasn't deleted!", INTERR);

    res.status(200).json({message: "supplier part was deleted successfully!", data: supplierParts});
  } catch(error){
    deleteSupplierPartsLog(error);
    errorHandler(res, error, "Failed! part of the supplier wasn't deleted!");
  }
};

const listSupplierParts = async(req, res) => {
  try {
    listSupplierPartsLog(req.body);
    let query = {};
    const limit = req.body.limit ? req.body.limit : 20;
    const skip = req.body.skip ? req.body.skip : 0;
    if (req.body.partNo) query.partNo = req.body.partNo;
    if (req.body.partName) query.partName = req.body.partName;
    if (req.body.SupplierID) query.SupplierID = SupplierID;

    listSupplierPartsLog(query);
    const supplierParts = await SupplierParts.find(query)
    .skip(skip)
    .limit(limit)
    .exec();
    
    if(!supplierParts || supplierParts.length === 0)
      throw new customError("Failed! there is no parts found!", INTERR);

    res.status(200).json({data: supplierParts})
  } catch(error) {
    listSupplierPartsLog(error);
    errorHandler(res, error, "Failed! cant get parts!");
  }
};

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
    errorHandler(res, error, "Failed! cant get Users!");
  }
};

const addService = async(req, res) => {
  try {
    let {serviceName, coverageDays, cost, note, dailyCost} = req.body;
    const service = new Service({
      name: serviceName,
      coverDays: coverageDays,
      cost,
      note,
      dailyCost
    });
    const savedService = await service.save();
    if(!savedService)
      throw new customError("Failed! service wasn't added!", INTERR);

    res.status(200).json({message: "Service was added successfully!", data: savedService});
  } catch(error) {
    addServiceLog(error);
    errorHandler(res, error, "Failed! service wasn't added!");
  }
};

const deleteService = async(req, res) => {
  try {
    let {serviceID} = req.body;
    const deletedService = await Service.findOneAndDelete({_id: serviceID}).exec();
    if(!deletedService)
      throw new customError("Failed! Service isn't deleted!", INTERR);

    res.status(200).json({message: "Service was added successfully!", data: deletedService});
  } catch(error) {
    deleteServiceLog(error);
    errorHandler(res, error, "Failed! service isn't deleted!");
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
    errorHandler(res, error, "Failed! can't get services!");
  }
};

const addAgentLimits = async(req, res) => {
  try {
    let {limitAmount, agentID} = req.body;
    addAgentLimitsLog(req.body);
    const agentLimits = new AgentLimits({
      totalMoney: limitAmount,
      agentID
    });
    const savedAgentLimits = await agentLimits.save();
    if(!savedAgentLimits)
      throw new customError("Failed! supplier part wasn't added!", INTERR);

    res.status(200).json({message: "agent limits was added successfully!", data: savedAgentLimits});
  } catch(error) {
    addServiceLog(error);
    errorHandler(res, error, "Failed! agent limits wasn't added!");
  }
};

const deleteAgentLimits = async(req, res) => {
  try {
    let {agentLimitID} = req.body;
    deleteAgentLimitsLog(req.body);
    const agentLimits = await AgentLimits.findOneAndDelete( 
      {$and: [
        {_id: agentLimitID},
        {$or: 
          [
            {services: {$exists: false}},
            {services: {$size: 0}}
          ]
        }
      ]}).exec();

    if(!agentLimits)
      throw new customError("Failed! agent limits wasn't deleted!", INTERR);

    res.status(200).json({message: "agent limits was deleted successfully!", data: agentLimits});
  } catch(error) {
    deleteAgentLimitsLog(error);
    errorHandler(res, error, "Failed! agent limits wasn't deleted!");
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
    errorHandler(res, error, "Failed! can't list agent limits!");
  }
};

module.exports = {
  listUsers,
  createUser,
  deleteUser,
  addService,
  deleteService,
  listServices,
  createSupplier,
  addSupplierParts,
  deleteSupplierParts,
  listSupplierParts,
  addAgentLimits,
  deleteAgentLimits,
  listMainAgentLimits
};