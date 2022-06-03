const db = require("../models");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const { 
  listServices: sharedlistServices,
  userShared
  } = require("./controller.shared");

const User = db.User;
const Role = db.Role;
const Service = db.Service;
const OtherServices = db.OtherServices;
const Accident = db.Accident;
const Account = db.Account;
const Car = db.Car;
const CarModel = db.CarModel;
const CarType = db.CarType;
const InsurancePolicy = db.InsurancePolicy;
const Region = db.Region;
const ServiceAccident = db.ServiceAccident;
const ServicePolicy = db.ServicePolicy;
const sequelizeDB = db.sequelize;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

//debugging NOT FOR PRODUCTION
const verifyLoggedInLog = util.debuglog("controller.admin-verifyLoggedIn");
const listUsersLog = util.debuglog("controller.admin-ListUsers");
const updateUserLog = util.debuglog("controller.admin-UpdateUser");
const createUserLog = util.debuglog("controller.admin-CreateUser");
const addServiceLog = util.debuglog("controller.admin-AddService");
const deleteServiceLog = util.debuglog("controller.admin-DeleteService");
const updateServiceLog = util.debuglog("controller.admin-UpdateService");
const addOtherServiceLog = util.debuglog("controller.admin-AddOtherService");
const deleteOtherServiceLog = util.debuglog("controller.admin-DeleteOtherService");
const listOtherServiceLog = util.debuglog("controller.admin-ListOtherService");
const updateOtherServiceLog = util.debuglog("controller.admin-UpdateOtherService");
const listServicesLog = util.debuglog("controller.admin-ListServices");
const addAgentLimitsLog = util.debuglog("controller.admin-AddAgentLimits");
const deleteAgentLimitsLog = util.debuglog("controller.admin-DeleteAgentLimits");
const listAgentLimitsLog = util.debuglog("controller.admin-listAgentLimits");

const verifyLoggedIn = async(req, res) => {
  try{
    if(!req.admin)
      throw new customError("Failed! Need to log in with admin account!", INTERR);

    res.status(200).json({message: "Admin is logged In!", data: req.admin});
  } catch(error){
    verifyLoggedInLog(error);
    errorHandler(res, error, "Failed! Need to log in with admin account!");
  }
}
const userActions = {
  create: async (req, res) => {
    try {
      const { roleId } = req.body;
        const role = await Role.findByPk(roleId, {raw: true});
  
        if(!role || !role.name)
          throw new customError("Failed! Role isn't exist!", INTERR);
  
      req.body.roleName = role.name;
      await userShared.createUser(res, req.body);
    } catch(error) {
      createUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  delete: async(req, res) => {
    const { userID } = req.params;
    query = { where: { id: userID }};
  
    await userShared.deleteUser(res, query);
  },
  update: async(req, res) => {
    try {
      let { userID } = req.params;
  
      if(!userID) 
        throw new customError("Failed! user data isn't provided!", INTERR);
  
      const query = { where: {id: userID} };
      const updateData = {};
      Object.entries(req.body).forEach((val, ind) => {
        updateUserLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'id')
          updateData[val[0]] = val[1];
      });

      updateUserLog(updateData, query);
      await userShared.updateUser(res, query, updateData);
    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  list: async(req, res) => {
    try {
      listUsersLog(req.body.agentID);
      let query = {where: {
        [Op.or]:[]
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
      if (req.body.role) query.where = ({'$Role.name$': req.body.role});
      if (req.body.agentID) query.where.agentId = req.body.agentID;
      if (req.body.regionID) query.where.regionId = req.body.regionID;
  
      if (req.body.companyName && req.body.username){
        query.where[Op.or] = [
          {companyName:{[Op.substring]: req.body.companyName}},
          {username:{[Op.substring]: req.body.username}}
        ];
      } else {
        if (req.body.companyName && req.body.username)
          query.where.companyName = {[Op.substring]: req.body.companyName};
        if (req.body.username)
          query.where.username = {[Op.substring]: req.body.username};
      }
   
      if (req.body.userID) query.where.id = req.body.userID;
  
      if(query.where[Op.or] && query.where[Op.or].length === 0) delete query.where[Op.or];
      // if(query.where[Op.and].length === 0) delete query.where[Op.and];

      listUsersLog(query);
      await userShared.listUsers(res, query, skip, limit, req.body.agent);
    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
  lightList: async(req, res) => {
    try {
      let query = {where: {
        [Op.or]: [],
        blocked: false
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.role) query.where = {['$Role.name$']: req.body.role};

      if (req.body.regionID) query.where.regionId = req.body.regionID;
  
      if (req.body.companyName && req.body.username){
        query.where[Op.or] = [
          {companyName:{[Op.substring]: req.body.companyName}},
          {username:{[Op.substring]: req.body.username}}
        ];
      } else {
        if (req.body.companyName && req.body.username)
          query.where.companyName = {[Op.substring]: req.body.companyName};
        if (req.body.username)
          query.where.username = {[Op.substring]: req.body.username};
      }

      if (req.body.userID) query.where.id = req.body.userID;
  
      if(query.where[Op.or] && query.where[Op.or].length === 0) delete query.where[Op.or];
      console.log((req.body.role ? { name: req.body.role} : {}));
      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
        {
          model: Role,
          required: true,
        }],
        offset: skip,
        limit: limit,
        attributes: ['id', 'username', 'companyName']
      };

      listUsersLog(query);
      const { count, rows: users } = await User.findAndCountAll(query);

      res.status(200).json({data: users, total: count});

    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
};

const serviceActions = {

  add: async(req, res) => {
    try {
      let {name, coverageDays, cost, supplierPercentage, note} = req.body;

      const service = Service.build({
        name,
        coverageDays,
        cost,
        note,
        supplierPercentage
      });

      const savedService = await service.save();

      if(!savedService)
        throw new customError("Failed! service wasn't added!", INTERR);
  
      res.status(200).json({message: "Service was added successfully!", data: savedService.toJSON()});
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! service wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { serviceID } = req.params;
      
      if(!serviceID || !Number(serviceID)) 
        throw new customError("Failed! service data isn't provided!", INTERR);
      
      const deletedService = await Service.destroy({ where: { id: serviceID }});

      if(!deletedService)
        throw new customError("Failed! Service isn't deleted!", INTERR);
  
      res.status(200).json({message: "Service was added successfully!", data: deletedService});
    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! service isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { serviceID } = req.params;
  
      if(!serviceID || !Number(serviceID)) 
        throw new customError("Failed! service data isn't provided!", INTERR);
  
      const query = { where: {id: serviceID} };
      const updateData = {};

      Object.entries(req.body).forEach((val, ind) => {
        updateServiceLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'serviceID')
          updateData[val[0]] = val[1];
      });

      updateServiceLog(updateData);
      const updatedService = await Service.update(updateData, query);
      updateServiceLog(updatedService);

      if(updatedService[0]!== 1) 
        throw new customError("Failed! service isn't updated!", INTERR);
  
      res.status(200).json({message: "Service was updated successfully!", data: updatedService[0]});
    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Service wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
  
      if (req.body.serviceName) 
        query.where.name = {[Op.substring]: req.body.serviceName};
      
      if (req.body.serviceID)
        query.where.id = req.body.serviceID;
      
      listServicesLog(query);
      await sharedlistServices(res, query, skip, limit);
  
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get services!");
    }
  },
};

const otherServiceActions = {

  add: async(req, res) => {
    try {

      let { 
        name,
        serviceKind,
        fileStatus,
        descCustomer,
        description,
        cost,
        insurancePolicyId,
        customerId 
      } = req.body;

      const otherService = OtherServices.build({
        name,
        serviceKind,
        fileStatus,
        descCustomer,
        description,
        cost,
        customerId,
        insurancePolicyId
      });

      const savedOtherService = await otherService.save();

      if(!savedOtherService)
        throw new customError("Failed! Other Service wasn't added!", INTERR);
  
      res.status(200).json({message: "Other Service was added successfully!", data: savedOtherService.toJSON()});
    } catch(error) {
      addOtherServiceLog(error);
      errorHandler(res, error, "Failed! Other Service wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { otherServiceID } = req.params;

      if(!otherServiceID || !Number(otherServiceID))
        throw new customError("Failed! Other Service data isn't provided!", INTERR);
      
      const deletedOtherService = await OtherServices.destroy({ where: { id: otherServiceID }});

      if(!deletedOtherService)
        throw new customError("Failed! Other Service isn't deleted!", INTERR);
  
      res.status(200).json({message: "Other Service was added successfully!", data: deletedOtherService});
    } catch(error) {
      deleteOtherServiceLog(error);
      errorHandler(res, error, "Failed! Other Service isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { otherServiceID } = req.params;
  
      if(!otherServiceID || !Number(otherServiceID))
        throw new customError("Failed! Other Service data isn't provided!", INTERR);
  
      const query = { where: {id: otherServiceID} };
      const updateData = {};

      Object.entries(req.body).forEach((val, ind) => {
        updateServiceLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'otherServiceID')
          updateData[val[0]] = val[1];
      });

      updateOtherServiceLog(updateData);
      const updatedOtherService = await OtherServices.update(updateData, query);
      updateOtherServiceLog(updatedOtherService);

      if(updatedOtherService[0] !== 1) 
        throw new customError("Failed! Other Service isn't updated!", INTERR);
  
      res.status(200).json({message: "Other Service was updated successfully!", data: updatedOtherService[0]});
    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Other Service wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
  
      if (req.body.fileStatus) 
        query.where.fileStatus = {[Op.substring]: req.body.fileStatus}; 

      if (req.body.customerID) 
        query.where.customerId = req.body.customerID;
        
      if (req.body.insurancePolicyID) 
        query.where.insurancePolicyId = req.body.insurancePolicyID;
      
      if (req.body.otherServiceID)
        query.where.id = req.body.otherServiceID;

      if (req.body.startDate && req.body.endDate){
        query.where.createdAt = {
          [Op.between]: [
            new Date(req.body.startDate).setHours(0, 0, 0, 0),
            new Date(req.body.endDate).setHours(23, 59 , 59, 59)
          ]
        };
      } else if(req.body.startDate){
        query.where.createdAt = {
          [Op.gte]: new Date(req.body.startDate).setHours(0, 0, 0, 0),
        };
      } else if(req.body.endDate){
        query.where.createdAt = {
          [Op.lte]: new Date(req.body.endDate).setHours(23, 59 , 59, 59),
        };
      }
      
      listOtherServiceLog(query);
      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
          {
            model: User,
            as: 'Customer',
            required: true,
            attributes: ['id', 'username', 'identityNum', 'address', 'jawwal1', 'jawwal2'],
            include:[
              {
                model: Region,
                required: true,
                attributes: ['name']
              }
            ]
          },
          {
            model: InsurancePolicy,
            required: true,
            include:[
              {
                model: Car,
                required: true,
                include: [
                  {
                    model: CarType,
                    required: true
                  },
                  {
                    model: CarModel,
                    required: true
                  }
                ]
              }
            ]
          }
        ],
        offset: skip,
        limit: limit,
      };
      const { count , rows: otherServices} = await OtherServices.findAndCountAll(query);
  
      listOtherServiceLog(otherServices);
      res.status(200).json({data: otherServices, total: count});
  
    } catch(error) {
      listOtherServiceLog(error);
      errorHandler(res, error, "Failed! can't get other services!");
    }
  },
};

const agentActions = {
  add: async(req, res) => {
    try {
      let { debit, agentID } = req.body;
      addAgentLimitsLog(req.body);
      sequelizeDB.transaction( async t => {
        const account = Account.build({
          debit,
          agentId: agentID
        }, { isNewRecord: true, transaction: t });
  
        const savedAccount = await account.save();
  
        if(!savedAccount && !account.id)
          throw new customError("Failed! Agent limit wasn't added!", INTERR);

        res.status(200).json({message: "Agent limits was added successfully!", data: savedAccount});
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Agent limits wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { agentLimitID } = req.params;

      if(!agentLimitID || !Number(agentLimitID)) 
        throw new customError("Failed! Agent limits data isn't provided!", INTERR);

      deleteAgentLimitsLog(req.body);
      sequelizeDB.transaction( async t => {
        
        const agentLimits = await Account.destroy({ where: { id: agentLimitID }},
           { transaction: t});

        if(!agentLimits)
          throw new customError("Failed! Agent limits wasn't deleted!", INTERR);
  
        res.status(200).json({message: "Agent limits was deleted successfully!", data: agentLimits});
      });
    } catch(error) {
      deleteAgentLimitsLog(error);
      errorHandler(res, error, "Failed! Agent limits wasn't deleted!");
    }
  },
  list: async(req, res) => {
    try {
      listAgentLimitsLog(req.body);
      let query = {where:{}};

      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.main) query.where.debit = { [Op.ne]: null };
  
      query = { ...query, 
        order: [['id', 'ASC' ]],
        offset: skip,
        limit: limit,
      };

      if (req.body.agentID) query.where = {agentId: req.body.agentID};

      const { count, rows: agentLimits } = await Account.findAndCountAll(query);
  
      listAgentLimitsLog(agentLimits);
      res.status(200).json({data: agentLimits, count});
    } catch(error) {
      listAgentLimitsLog(error);
      errorHandler(res, error, "Failed! can't list agent limits!");
    }
  },
};

const accidentActions = {
  add: async(req, res) => {
    try {
      let {
        // name,
        accidentPlace,
        accidentDate,
        registerAccidentDate,
        driverName,
        driverIdentity,
        accidentDescription,
        expectedCost,
        note,
        customerId,
        agentId,
        carId,
        regionId,
        services
      } = req.body;

     await sequelizeDB.transaction( async t => {

        const accident = Accident.build({
          // name,
          accidentPlace,
          accidentDate,
          registerAccidentDate,
          driverName,
          driverIdentity,
          accidentDescription,
          expectedCost,
          note,
          customerId,
          agentId,
          carId,
          regionId
        }, { isNewRecord: true, transaction: t });

        const savedAccident = await accident.save();

        if(!savedAccident || !accident.id)
          throw new customError("Failed! Accident wasn't added!", INTERR);

        const serviceAccidentObj = new Set();

        services.forEach((service, i) => {
          serviceAccidentObj.add({
            coverageDays: service.coverageDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            accidentId: accident.id,
          });
        });

        const serviceAccidents = await ServiceAccident.bulkCreate([...serviceAccidentObj],
          { transaction: t});
        addServiceLog(serviceAccidents);

        if(serviceAccidents.length === 0)
          throw new customError("Failed! Accident wasn't added!", INTERR);

        res.status(200).json({
          message: "Accident was added successfully!",
          data: {accident: savedAccident.toJSON(), serviceAccidents: serviceAccidents}
        });
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Accident wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { accidentId: accidentID } = req.params;

      if(!accidentID || !Number(accidentID))
        throw new customError("Failed! Accident data isn't provided!", INTERR);

      await sequelizeDB.transaction( async t => {
        const deletedAccidentServices = await ServiceAccident.destroy({ where: 
          { accidentId: accidentID }}, 
          {transaction: t});

        if(!deletedAccidentServices)
          throw new customError("Failed! Accident isn't deleted!", INTERR);

        const deletedAccident = await Accident.destroy({ where: { id: accidentID }}, 
          {transaction: t});

        if(!deletedAccident)
          throw new customError("Failed! Accident isn't deleted!", INTERR);
    
        res.status(200).json({
          message: "Accident was deleted successfully!",
          data: {accident: deletedAccident, serviceAccidents: deletedAccidentServices}
        });
      });

    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Accident isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let {
        services
       } = req.body;

      const { accidentId: accidentID } = req.params;
  
      if(!accidentID || !Number(accidentID)) 
        throw new customError("Failed! Accident data isn't provided!", INTERR);
  
      const query = { where: {id: accidentID} };
      const updateData = {};

      Object.entries(req.body).forEach((val, ind) => {
        updateServiceLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'accidentID' && val[0] !== 'services')
          updateData[val[0]] = val[1];
      });

      updateServiceLog(updateData);
      const updatedAccident = await Accident.update(updateData, query);
      
      if(updatedAccident[0]!== 1) 
        throw new customError("Failed! Accident isn't updated!", INTERR);

      let serviceAccidentObj = [];
      let servAccIds = [];

      services.forEach((service, i) => {
        if(service.id)
          servAccIds.push(service.id);

        serviceAccidentObj[i] = {
          id: service.id,
          coverageDays: service.coverageDays,
          note: service.note,
          serviceId: service.serviceId,
          supplierId: service.supplierId,
          accidentId: accidentID,
        };
      });

      //delete services that are not provided by ids
      const deletedServiceAccident = await ServiceAccident.destroy({ 
        where: {
          [Op.and]: {
            id:{ [Op.notIn]: [...servAccIds] },
            accidentId: accidentID
          }
        }
      },
      { transaction: t});

      //update exist one and add the new services
      const updateServiceAccidents = await ServiceAccident.bulkCreate(serviceAccidentObj,
        { updateOnDuplicate: ["id"] , transaction: t});     
      
  
      updateServiceLog(deletedServiceAccident);
      res.status(200).json({
        message: "Accident was updated successfully!", 
        data: {
          accident: updatedAccident[0],
          serviceAccidents: updateServiceAccidents[0],
          deletedServiceAccidents: deletedServiceAccident
        }
      });
    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Accident wasn't updated!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: {} };
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.accidentID) 
        query.where.id = req.body.accidentID;
     
      if (req.body.carNumber) 
        query.where.carNumber = req.body.carNumber; 
      
      if (req.body.carID) 
        query.where.carId = req.body.carID;
      
      if (req.body.accidentPlace)
        query.where.accidentPlace = req.body.accidentPlace; 

      if (req.body.agentID)
        query.where.agentId = req.body.agentID;

      if (req.body.accidentDate)
        query.where.accidentDate = req.body.accidentDate;
        
      if (req.body.driverIdentity)
        query.where.driverIdentity = req.body.driverIdentity;

      if (req.body.customerID)
        query.where.customerId = req.body.customerID;

      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
        {
          model: ServiceAccident,
          required: true,
          separate: true,
          include: [
            {
              model: Service,
              required: true,
              attributes: ['id', 'name', 'cost', 'coverageDays']
            },
            {
              model: User,
              as: 'Supplier',
              required: true,
              attributes: ['id', 'username', 'companyName']
            }
          ]
        },
        {
          model: User,
          required: true,
          as: 'Agent',
          include:[
            {
              model: Role,
              required: true
            },
            {
              model: Region,
              required: true
            }
          ],
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: User,
          required: true,
          as: 'Customer',
          include:[
            {
              model: Role,
              required: true
            },
            {
              model: Region,
              required: true
            }
          ],
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: Car,
          required: true,
          include: [
            {
              model: CarType,
              require: true,
            },
            {
              model: CarModel,
              require: true,
            }
          ]
        },
        {
          model: Region,
          required: true,
        }],
        offset: skip,
        limit: limit,
        attributes: { exclude: ['carId', 'customerId', 'agentId', 'regionId']}
      };

      //TODO what is this for?!
      // if (req.body.customerID)
      //   query.include[2].where.agentId = req.body.customerID;

      const { count, rows: Accidents } = await Accident.findAndCountAll(query);

      if(count == null || Accidents == null) 
        throw new customError("Failed! Accident data isn't retrieved!", INTERR);
      
      listServicesLog(query);
      res.status(200).json({data: Accidents, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get Accidents!");
    }
  },
};

const accountActions = {
  list: async(req, res) => {
    try{
      let query = {where:{}};
      let agentBalance = 0;

      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.accountId){
        query.where.id = req.body.accountId;
      }

      if (req.body.startDate && req.body.endDate){
        query.where.createdAt = {
          [Op.between]: [
            new Date(req.body.startDate).setHours(0, 0, 0, 0),
            new Date(req.body.endDate).setHours(23, 59 , 59, 59)
          ]
        };
      } else if(req.body.startDate){
        query.where.createdAt = {
          [Op.gte]: new Date(req.body.startDate).setHours(0, 0, 0, 0),
        };
      } else if(req.body.endDate){
        query.where.createdAt = {
          [Op.lte]: new Date(req.body.endDate).setHours(23, 59 , 59, 59),
        };
      }

      if (req.body.agentID){
        query.where[Op.or] = [
          {agentId: req.body.agentID},
          {'$InsurancePolicy.agentId$': req.body.agentID},
        ];
        agentBalance = await agentAccount(req);
      }

      // if (req.body.customerID)
      //   query.where.customerID = req.body.customerID;
        
      if(Object.keys(query.where) === 0 ) delete query.where;

      if(req.body.insurancePolicyId){
        query = { ...query,
          order: [['id', 'ASC' ]],
          include: [
            {
              model: InsurancePolicy,
              required: true,
              where: {id: req.body.insurancePolicyId}
            }
          ],
          offset: skip,
          limit: limit,
        };
      } else if(req.body.agentID){
          query = { ...query,
            order: [['id', 'ASC' ]],
            include: [
              {
                model: InsurancePolicy,
                required: false,
                // where: { agentId: req.body.agentID },
              },
              {
                model: User,
                required: false,
                // where: { id: req.body.agentID },
                attributes: { exclude: ['passowrd']}
              },
            ],
            offset: skip,
            limit: limit,
          };     
      } else {
        query = { ...query,
          order: [['id', 'ASC' ]],
          include: [
            {
              model: InsurancePolicy,
              required: false,
            },
            {
              model: User,
              required: false,
              attributes: { exclude: ['passowrd']}
            },
          ],
          offset: skip,
          limit: limit,
        };     
      }
      
      var { count, rows: accounts } = await Account.findAndCountAll(query);
  
      listServicesLog(query);
      res.status(200).json({data: accounts, agentBalance, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get Accounts!");
    }
  },
};

const SupplierActions = {
  list: async(req, res) => {
    let flag = {
      'accident': ServiceAccident,
      'policy': ServicePolicy
    };

    try {
      let query = { where: {supplierId: req.body.supplierID}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if(req.body.startDate && req.body.endDate){
         query.where.createdAt = {
          [Op.between]: [
            new Date(req.body.startDate).setHours(0, 0, 0, 0),
            new Date(req.body.endDate).setHours(23, 59 , 59, 59)
          ]
        };
      } else if(req.body.startDate){
        query.where.createdAt = {
          [Op.gte]: new Date(req.body.startDate).setHours(0, 0, 0, 0),
        };
      } else if(req.body.endDate){
        query.where.createdAt = {
          [Op.lte]: new Date(req.body.endDate).setHours(23, 59 , 59, 59),
        };
      }
       

      query = {
        ...query,
        include: [
          {
            model: Service,
            required: true,
          }
        ],
        offset: skip,
        limit: limit,
      };

      const { count, rows: accountSupplier } = await flag[req.body.flag].findAndCountAll(query);

      if(count == null || accountSupplier == null) 
        throw new customError("Failed! Account for Supplier isn't retrieved!", INTERR);

      listServicesLog(accountSupplier);
      res.status(200).json({data: accountSupplier, total: count});
    } catch(error){
      addServiceLog(error);
      errorHandler(res, error, "Failed! Account for Supplier wasn't retrieved!");
    }
  }

};

const insurancePolicyActions = {
  add: async(req, res) => {
    try {
      let {
        totalPrice,
        note,
        expireDate,
        customerId,
        agentId,
        carId,
        services
      } = req.body;

      let availableLimit = await checkLimits(req);

      if(!availableLimit)
        throw new customError("لا يوجد رصيد كافي لاجراء هذه العملية!", INTERR);

     await sequelizeDB.transaction( async t => {

        const insurancePolicy = InsurancePolicy.build({
          totalPrice,
          expireDate,
          note,
          customerId,
          agentId,
          carId,
        }, { isNewRecord: true, transaction: t });

        const savedInsurancePolicy = await insurancePolicy.save();

        if(!savedInsurancePolicy || !insurancePolicy.id)
          throw new customError("Failed! Insurance Policy wasn't added!", INTERR);

        let servicePolicyArray = [];
        // let supplierAccountArray = [];
        services.forEach((service, i) => {
          servicePolicyArray[i] = {
            cost: service.cost,
            additionalDays: service.additionalDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            insurancePolicyId: insurancePolicy.id,
            supplierPercentage: service.supplierPercentage
          };
        });

        const servicesPolicy = await ServicePolicy.bulkCreate(servicePolicyArray,
          { transaction: t});
        
        addServiceLog(servicesPolicy);

        if(servicesPolicy.length === 0)
          throw new customError("Failed! Services Policy wasn't added!", INTERR);

        const account = Account.build({
          insurancePolicyId: insurancePolicy.id,
          credit: totalPrice,
        }, { 
          isNewRecord: true,
          transaction: t 
        });
    
        const savedAccount = await account.save();

        if(!savedAccount)
          throw new customError("Failed! Account wasn't added!", INTERR);

        res.status(200).json({
          message: "Insurance Policy was added successfully!",
          data: {
            insurancePolicy: savedInsurancePolicy.toJSON(),
            servicesPolicy: servicesPolicy
          }
        });
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Insurance Policy wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      const { insurancePolicyId } = req.params;
      
      if(!insurancePolicyId || !Number(insurancePolicyId))
        throw new customError("Failed! Insurance Policy data isn't provided!", INTERR);

      await sequelizeDB.transaction( async t => {
        const deletedServicesPolicy = await ServicePolicy.destroy({ where: 
          { insurancePolicyId }}, 
          { transaction: t });

        if(!deletedServicesPolicy)
          throw new customError("Failed! Services Policy isn't deleted!", INTERR);

        const deletedAccount = await Account.destroy({ where: { insurancePolicyId: insurancePolicyId }}, 
          {transaction: t});
    
        if(!deletedAccount)
          throw new customError("Failed! Account wasn't deleted!", INTERR);

        const deletedInsurancePolicy = await InsurancePolicy.destroy({ where: { id: insurancePolicyId }}, 
          {transaction: t});

        if(!deletedInsurancePolicy)
          throw new customError("Failed! Insurance Policy isn't deleted!", INTERR);

        res.status(200).json({
          message: "Insurance Policy was deleted successfully!",
          data: {insurancePolicy: deletedInsurancePolicy, servicesPolicy: deletedServicesPolicy}
        });
      });

    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Insurance Policy isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { totalPrice, services } = req.body;

      const { insurancePolicyId } = req.params;
      
      if(!insurancePolicyId || !Number(insurancePolicyId))
        throw new customError("Failed! Insurance Policy data isn't provided!", INTERR);
  
      await sequelizeDB.transaction( async t => {
        const query = { where: {id: insurancePolicyId} };
        const updateData = {};

        Object.entries(req.body).forEach((val, ind) => {
          updateServiceLog(val[0], val[1])
          if(val && val.length > 0 && val[0] !== 'insurancePolicyId' && val[0] !== 'services')
            updateData[val[0]] = val[1];
        });

        updateServiceLog(updateData);
        const updatedInsurancePolicy = await InsurancePolicy.update(updateData, query);
        
        if(updatedInsurancePolicy[0]!== 1) 
          throw new customError("Failed! Insurance Policy isn't updated!", INTERR);

        let servicePolicyArray = [];
        let servAPolicyIds = [];

        services.forEach((service, i) => {
          if(service.id)
            servAPolicyIds.push(service.id);

            servicePolicyArray[i] = {
              id: service.id,
              cost: service.cost,
              additionalDays: service.additionalDays,
              note: service.note,
              serviceId: service.serviceId,
              supplierId: service.supplierId,
              insurancePolicyId: insurancePolicyId,
              supplierPercentage: service.supplierPercentage
            };
        });

        //delete services that are not provided by ids
        const deletedServicePolicy = await ServicePolicy.destroy({ 
          where: {
            [Op.and]: {
              id:{ [Op.notIn]: [...servAPolicyIds] },
              insurancePolicyId: insurancePolicyId
            }
          }
        },
        { transaction: t});

        //update exist one and add the new services
        const updateServicesPolicy = await ServicePolicy.bulkCreate(servicePolicyArray,
          { updateOnDuplicate: ["id"] , transaction: t});
          
        const updatedAccount = await Account.update({credit: totalPrice}, {where: {insurancePolicyId: insurancePolicyId}}, { transaction: t});
    
        if(!updatedAccount)
          throw new customError("Failed! Account wasn't updated!", INTERR);
        
        updateServiceLog(deletedServicePolicy);
        res.status(200).json({
          message: "Insurance Policy was updated successfully!", 
          data: {
            insurancePolicy: updatedInsurancePolicy[0],
            servicesPolicy: updateServicesPolicy[0],
            deletedServicesPolicy: deletedServicePolicy
          }
        });
      });
      
    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Insurance Policy wasn't updated!");
    }
  },
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.insurancePolicyId) 
        query.where.id = req.body.insurancePolicyId;
      
      if (req.body.carID) 
        query.where.carId = req.body.carID;

      if (req.body.agentID)
        query.where.agentId = req.body.agentID;

      if (req.body.customerID)
        query.where.customerId = req.body.customerID;

      if(req.body.filterOutValid){
        query.where.expireDate = {[Op.gte]: new Date().setHours(0, 0, 0, 0)}
      }
        
      if(Object.keys(query.where) === 0 ) delete query.where;
      
      query = { ...query,
        order: [['id', 'ASC' ]],
        include: [{
          model: ServicePolicy,
          required: true,
          separate: true,
          include: [
            {
              model: Service,
              required: true,
              attributes: ['id', 'name', 'cost', 'coverageDays', 'supplierPercentage']
            },
            {
              model: User,
              as: 'Supplier',
              required: true,
              attributes: ['id', 'username', 'companyName']
            }
          ]
        },
        {
          model: User,
          required: true,
          as: 'Agent',
          include:[
            {
              model: Role,
              required: true
            },
            {
              model: Region,
              required: true
            }
          ],
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: User,
          required: true,
          as: 'Customer',
          include:[
            {
              model: Role,
              required: true
            },
            {
              model: Region,
              required: true
            }
          ],
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: Car,
          required: true,
          include: [
            {
              model: CarType,
              require: true,
            },
            {
              model: CarModel,
              require: true,
            }
          ]
        }
      ],
        offset: skip,
        limit: limit,
        attributes: { exclude: ['carId', 'customerId', 'agentId']}
      };

      //TODO doesn't make sense! what is for?
      // if (req.body.agentID)
      //   query.include[2].where.agentId = req.body.agentID;

      let { count, rows: insurancePolices } = await InsurancePolicy.findAndCountAll(query);

      if(req.body.filterOutValid){
        if(count === 0)
          throw new customError("لا يوجد بوليصة تأمين متاحة او غير منتهية", INTERR);
      }

      listServicesLog(query);
      res.status(200).json({data: insurancePolices, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get Insurance Policies!");
    }
  },
};

const carActions = {
  add: async(req, res) => {
    try {
      let {
        carNumber,
        motorNumber,
        motorPH,
        serialNumber,
        passengersCount,
        productionYear,
        licenseType,
        color,
        note,
        carTypeId,
        carModelId,
        customerId,
      } = req.body;

      const car = Car.build({
        carNumber,
        motorNumber,
        motorPH,
        serialNumber,
        passengersCount,
        productionYear,
        licenseType,
        color,
        note,
        carTypeId,
        carModelId,
        customerId,
      }, { isNewRecord: true });

      const savedCar = await car.save();

      if(!savedCar)
        throw new customError("Failed! Car wasn't added!", INTERR);
  
      res.status(200).json({
        message: "Car was added successfully!",
        data: savedCar.toJSON()
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Car wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { carId } = req.params;

      if(!carId || !Number(carId))
        throw new customError("Failed! Car data isn't provided!", INTERR);

      const deletedCar = await Car.destroy({ where: { id: carId } });

      if(!deletedCar)
        throw new customError("Failed! Car isn't deleted!", INTERR);
  
      res.status(200).json({
        message: "Car was deleted successfully!",
        data: deletedCar
      });
    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Car isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { carId } = req.params;
      
      if(!carId || !Number(carId))
        throw new customError("Failed! Car data isn't provided!", INTERR);

      const query = { where: {id: carId} };
      const updateData = {};
      Object.entries(req.body).forEach((val, ind) => {
        updateUserLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'carId')
          updateData[val[0]] = val[1];
      });
      updateUserLog(updateData, query);

      const updatedCar = await Car.update(updateData, query);
      updateUserLog(updatedCar[0]);

      if(updatedCar[0]!== 1) 
        throw new customError("Failed! Car isn't updated!", INTERR);

      res.status(200).json({message: "Car was updated successfully!", data: updatedCar[0]});

    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! Car wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: {} };
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
        
      if (req.body.carId) 
        query.where.id = req.body.carId;

      if (req.body.carNumber) 
        query.where.carNumber = req.body.carNumber;
      
      if (req.body.customerID)
        query.where.customerId = req.body.customerID; 

      if (req.body.serialNumber)
        query.where.serialNumber = req.body.serialNumber;

      if (req.body.motorNumber)
        query.where.motorNumber = req.body.motorNumber;

      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
        {
          model: User,
          required: true,
          include: [
            {
              model: Region,
              required: true
            },
            {
              model: Role,
              required: true
            },
            {
              model: User,
              as: 'Agent',
              required: false //TODO should be true because each customer has an agent
            }
          ],
          attributes: { exclude: ['password', 'note', 'regionId', 'roleId', 'agentId'] }
        },
        {
          model: CarType,
          required: true,
        },
        {
          model: CarModel,
          required: true,
        }],
        offset: skip,
        limit: limit,
        attributes: { exclude: ['carModelId', 'customerId', 'carTypeId']}
      };

      const { count, rows: Cars } = await Car.findAndCountAll(query);
  
      listServicesLog(query);
      res.status(200).json({data: Cars, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get Cars!");
    }
  },
};

const carTypeActions = {
  add: async(req, res) => {
    try {
      let {
        name
      } = req.body;

      const carType = CarType.build({
        name
      }, { isNewRecord: true });

      const savedCarType = await carType.save();

      if(!savedCarType)
        throw new customError("Failed! Car Type wasn't added!", INTERR);
  
      res.status(200).json({
        message: "Car Type was added successfully!",
        data: savedCarType.toJSON()
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Car Type wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { carTypeId } = req.params;

      if(!carTypeId || !Number(carTypeId))
        throw new customError("Failed! Car Type data isn't provided!", INTERR);

      const deletedCarType = await CarType.destroy({ where: { id: carTypeId } });

      if(!deletedCarType)
        throw new customError("Failed! Car Type isn't deleted!", INTERR);
  
      res.status(200).json({
        message: "Car Type was deleted successfully!",
        data: deletedCarType
      });
    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Car Type isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { name } = req.body;
      let { carTypeId } = req.params;
  
      if(!carTypeId || !Number(carTypeId))
        throw new customError("Failed! Car Type data isn't provided!", INTERR);

      const query = { where: {id: carTypeId} };
      const updateData = { name: name};
      updateUserLog(updateData, query);

      const updatedCarType = await CarType.update(updateData, query);
      updateUserLog(updatedCarType[0]);

      if(updatedCarType[0]!== 1) 
        throw new customError("Failed! Car Type isn't updated!", INTERR);

      res.status(200).json({message: "Car Type was updated successfully!", data: updatedCarType[0]});

    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! Car Type wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: {} };
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
        
      if (req.body.name) 
        query.where.name = {[Op.substring]: req.body.name}
      
      if (req.body.carTypeId)
        query.where.id = req.body.carTypeId; 

      query = { ...query, 
        order: [['id', 'ASC' ]],
        offset: skip,
        limit: limit,
      };

      const { count, rows: CarTypes } = await CarType.findAndCountAll(query);
  
      listServicesLog(query);
      res.status(200).json({data: CarTypes, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get Car Types!");
    }
  },
};

const carModelActions = {
  add: async(req, res) => {
    try {
      let {
        carTypeId,
        name
      } = req.body;

      const carModel = CarModel.build({
        name,
        carTypeId
      }, { isNewRecord: true });

      const savedCarModel = await carModel.save();

      if(!savedCarModel)
        throw new customError("Failed! Car Model wasn't added!", INTERR);
  
      res.status(200).json({
        message: "Car Model was added successfully!",
        data: savedCarModel.toJSON()
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Car Model wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { carModelId } = req.params;

      if(!carModelId || !Number(carModelId))
        throw new customError("Failed! Car Model data isn't provided!", INTERR);

      const deletedCarModel = await CarModel.destroy({ where: { id: carModelId } });

      if(!deletedCarModel)
        throw new customError("Failed! Car Model isn't deleted!", INTERR);
  
      res.status(200).json({
        message: "Car Model was deleted successfully!",
        data: deletedCarModel
      });
    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! Car Model isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { name, carTypeId } = req.body;
      const { carModelId } = req.params;

      if(!carModelId || !Number(carModelId))
        throw new customError("Failed! Car Model data isn't provided!", INTERR);
  
      const query = { where: {id: carModelId} };
      const updateData = {};

      if(carTypeId) updateData['carTypeId'] = carTypeId;
      if(name) updateData['name'] = name;

      updateUserLog(updateData, query);

      const updatedCarModel = await CarModel.update(updateData, query);
      updateUserLog(updatedCarModel[0]);

      if(updatedCarModel[0]!== 1) 
        throw new customError("Failed! Car Model isn't updated!", INTERR);

      res.status(200).json({message: "Car Model was updated successfully!", data: updatedCarModel[0]});

    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! Car Model wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: {} };
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
        
      if (req.body.name) 
        query.where.name = {[Op.substring]: req.body.name}
      
      if (req.body.carTypeId)
        query.where.carTypeId = req.body.carTypeId;   

      if (req.body.carModelId)
        query.where.id = req.body.carModelId; 

      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [{
          model: CarType,
          required: true,
        }],
        attributes: { exclude: ['carTypeId'] },
        offset: skip,
        limit: limit,
      };

      const { count, rows: carModels } = await CarModel.findAndCountAll(query);
  
      listServicesLog(query);
      res.status(200).json({data: carModels, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get Car Models!");
    }
  },
};

const regionActions = {
  list: async(req, res) => {
    try {
      const regions = await Region.findAll();
  
      if(!regions) 
        throw new customError("Failed! can't get regions!");

      res.status(200).json({
        message: "Regions were reterived successfully!",
        data: regions
      });   
    } catch(error){
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
}

const statisticsActions = {
  list: async(req, res) => {
    try {
      const agents = await User.count({ where: {roleId: 2}});
      const customers = await User.count({ where: {roleId: 3}});
      const suppliers = await User.count({ where: {roleId: 4}});
      const insurancePolicies = await InsurancePolicy.count();
      const accidents = await Accident.count();
  
      if(agents == null ||
          customers == null ||
          suppliers == null ||
          insurancePolicies == null ||
          accidents == null) 
        throw new customError("Failed! can't get Statistics!");

      res.status(200).json({
        message: "Statistics were reterived successfully!",
        data: {
          agents,
          customers,
          suppliers,
          insurancePolicies,
          accidents
        }
      });   
    } catch(error){
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
}

const sharedActions = {
  getRegionsAndRoles: async(req, res) => {
    try {
      const roles = await Role.findAll();
      const regions = await Region.findAll();
  
      if(!regions || !roles) 
        throw new customError("Failed! can't get data!");

      res.status(200).json({
        message: "Regions and Roles were reterived successfully!",
        data: {roles, regions}
      });   
    } catch(err){
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
}

/* ######################### Internal Method ##################### */

const checkLimits = async (req) => {
  const totalDebit = await Account.findAll({
    where: { agentId: req.body.agentId },
    attributes: [
       [sequelize.fn('sum', sequelize.col('debit')), 'debit'],
    ],
    group: ['agentId']
  });

  const totalCredit = await Account.findAll({
    include:[
      {
        model: InsurancePolicy,
        require: true,
        where: { agentId: req.body.agentId },
        attributes: []
      }
    ],
    attributes: [
       [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
    ],
    group: ['InsurancePolicy.agentId']
  });

  let totalDebitVal = Number(totalDebit[0]?.debit || 0),
      totalCreditVal = Number(totalCredit[0]?.credit || 0),
      totalPricePolicy = Number(req.body.totalPrice);

    let finalAccount = ((totalDebitVal - (totalCreditVal + totalPricePolicy)) > 0);
    return finalAccount;
}

const agentAccount = async (req) => {
  const totalDebit = await Account.findAll({
    where: { agentId: req.body.agentID },
    attributes: [
       [sequelize.fn('sum', sequelize.col('debit')), 'debit'],
    ],
    group: ['agentId']
  });

  const totalCredit = await Account.findAll({
    include:[
      {
        model: InsurancePolicy,
        require: true,
        where: { agentId: req.body.agentID },
        attributes: []
      }
    ],
    attributes: [
       [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
    ],
    group: ['InsurancePolicy.agentId']
  });

  let totalDebitVal = Number(totalDebit[0]?.debit || 0),
      totalCreditVal = Number(totalCredit[0]?.credit || 0);

    let finalAccount = totalDebitVal - totalCreditVal;
    return finalAccount;
}
// const filterInsurancePolicy = async(insurancePolices) => {
//   let validInsurancePolicies = [];
//   console.log('here is me ', insurancePolices);
//   insurancePolices.forEach(insuPol => {
//     if ((new Date(insuPol.expireDate)).setHours(0,0,0,0) >= (new Date()).setHours(0,0,0,0))
//       validInsurancePolicies.push(insuPol)
//   });
//   return validInsurancePolicies;
// }

/* ######################### Internal Method ##################### */


module.exports = {
  userActions,
  serviceActions,
  otherServiceActions,
  agentActions,
  sharedActions,
  accidentActions,
  carTypeActions,
  carModelActions,
  carActions,
  regionActions,
  insurancePolicyActions,
  accountActions,
  statisticsActions,
  SupplierActions,
};