const db = require("../models");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const { 
  listServices: sharedlistServices,
  listAgentLimits: sharedListAgentLimits,
  userShared
  } = require("./controller.shared");

const User = db.User;
const Role = db.Role;
const Service = db.Service;
const Accident = db.Accident;
const Account = db.Account;
const Car = db.Car;
const CarModel = db.CarModel;
const CarType = db.CarType;
const InsurancePolicy = db.InsurancePolicy;
const Region = db.Region;
const ServiceAccident = db.ServiceAccident;
const ServicePolicy = db.ServicePolicy;

const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const verifyLoggedInLog = util.debuglog("controller.admin-verifyLoggedIn");
const listUsersLog = util.debuglog("controller.admin-ListUsers");
const updateUserLog = util.debuglog("controller.admin-UpdateUser");
const createUserLog = util.debuglog("controller.admin-CreateUser");
const addServiceLog = util.debuglog("controller.admin-AddService");
const deleteServiceLog = util.debuglog("controller.admin-DeleteService");
const updateServiceLog = util.debuglog("controller.admin-UpdateService");
const listServicesLog = util.debuglog("controller.admin-ListServices");
const addAgentLimitsLog = util.debuglog("controller.admin-AddAgentLimits");
const deleteAgentLimitsLog = util.debuglog("controller.admin-DeleteAgentLimits");
const listAgentLimitsLog = util.debuglog("controller.admin-listAgentLimits");
const addSupplierPartsLog = util.debuglog("controller.admin-addSupplierParts");
const deleteSupplierPartsLog = util.debuglog("controller.admin-deleteSupplierParts");
const listSupplierPartsLog = util.debuglog("controller.admin-ListSupplierParts");

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
    const { username } = req.body;
    query = { where: { id: username }};
  
    await userShared.deleteUser(res, query);
  },
  update: async(req, res) => {
    try {
      let { id } = req.body;
  
      if(!id) 
        throw new customError("Failed! user data isn't provided!", INTERR);
  
      const query = { where: {id} };
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
        [Op.and]: [],
        [Op.or]: []
      }};
      const limit = req.body.limit;
      const skip = req.body.skip;
      if (req.body.role) query.where[Op.and].push({'$Role.name$': req.body.role});
      if (req.body.agentID) query.where[Op.and].push({agentId: req.body.agentID});
  
      if (req.body.companyName)
        query.where[Op.or].push({companyName: {[Op.substring]: req.body.companyName}});
      
      if (req.body.username)
        query.where[Op.or].push({username: {[Op.substring]: req.body.username}});
   
      // if (req.body.nickname) query = {...query, 'agent.agentNickname': req.body.nickname};
      if (req.body.userID) query.where[Op.and].push({id: req.body.userID});
  
      if(query.where[Op.or].length === 0) delete query.where[Op.or];
      if(query.where[Op.and].length === 0) delete query.where[Op.and];

      listUsersLog(query);
      await userShared.listUsers(res, query, skip, limit);
    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  }
};

const serviceActions = {

  add: async(req, res) => {
    try {
      let {name, coverageDays, cost, note} = req.body;

      const service = Service.build({
        name,
        coverageDays,
        cost,
        note
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
      let { serviceID } = req.body;
      
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
      let { serviceID } = req.body;
  
      if(!serviceID) 
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
      const limit = req.body.limit;
      const skip = req.body.skip;
  
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

const agentActions = {
  add: async(req, res) => {
    try {
      let { debit, agentID } = req.body;
      addAgentLimitsLog(req.body);

      const agentLimits = Account.build({
        debit,
        agentId: agentID
      });

      const savedAgentLimits = await agentLimits.save();

      if(!savedAgentLimits)
        throw new customError("Failed! Agent limit wasn't added!", INTERR);
  
      res.status(200).json({message: "Agent limits was added successfully!", data: savedAgentLimits});
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! Agent limits wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { agentLimitID } = req.body;
      deleteAgentLimitsLog(req.body);

      const agentLimits = await Account.destroy({ where: { id: agentLimitID }});
  
      if(!agentLimits)
        throw new customError("Failed! Agent limits wasn't deleted!", INTERR);
  
      res.status(200).json({message: "Agent limits was deleted successfully!", data: agentLimits});
    } catch(error) {
      deleteAgentLimitsLog(error);
      errorHandler(res, error, "Failed! Agent limits wasn't deleted!");
    }
  },
  list: async(req, res) => {
    try {
      listAgentLimitsLog(req.body);
      let query = {where:{}};
      const limit = req.body.limit;
      const skip = req.body.skip;
      if (req.body.agentID) query.where.agentId = req.body.agentID;
      if (req.body.main) query.where.debit = { [Op.ne]: null };
  
      await sharedListAgentLimits(res, query, skip, limit);
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
        name,
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

     await sequelize.Transaction( async t => {

        const accident = Accident.build({
          name,
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
          throw new customError("Failed! service wasn't added!", INTERR);

        let serviceAccidentObj = [];

        services.forEach((service, i) => {
          serviceAccidentObj[i] = {
            cost: service.cost,
            additionalDays: service.additionalDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            accidentId: accident.id
          };
        });

        const serviceAccidents = await ServiceAccident.bulkCreate(serviceAccidentObj,
          { transaction: t});
    
        res.status(200).json({
          message: "Service was added successfully!",
          data: {accident: savedAccident.toJSON(), serviceAccidents: serviceAccidents.toJSON()}
        });
      });
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! service wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { accidentID } = req.body;

      await sequelize.Transaction( async t => {
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
        accidentID,
        services
       } = req.body;
  
      if(!accidentID) 
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
          cost: service.cost,
          additionalDays: service.additionalDays,
          note: service.note,
          serviceId: service.serviceId,
          supplierId: service.supplierId,
          accidentId: accidentID
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
      let query = {};
      const limit = req.body.limit || 20;
      const skip = req.body.skip || 0;
        
      if (req.body.carNumber) 
        query.where.carNumber = req.body.carNumber; 
      
      if (req.body.carId) 
        query.where.carId = req.body.carId;
      
      if (req.body.accidentID)
        query.where.id = req.body.accidentID; 

      if (req.body.agentID)
        query.where.agentId = req.body.agentID;

      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [{
          model: ServiceAccident,
          required: true,
        },
        {
          model: User,
          required: true,
          as: 'Agent',
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: User,
          required: true,
          as: 'Customer',
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: Car,
          required: true,
        },
        {
          model: ServiceAccident,
          required: true,
        },
        {
          model: Region,
          required: true,
        }],
        offset: skip,
        limit: limit,
        attributes: { exclude: ['carId', 'customerId', 'agentId', 'regionId']}
      };

      if (req.body.customerID)
        query.include[2].where.agentId = req.body.customerID;

      const { count, rows: Accidents } = await Accident.findAndCountAll(query);
  
      listServicesLog(query);
      res.status(200).json({data: Accidents, total: count});
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get services!");
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
      let { carId } = req.body;

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
      let { carId } = req.body;
  
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
      const limit = req.body.limit || 20;
      const skip = req.body.skip || 0;
        
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
      let { carTypeId } = req.body;

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
      let { name, carTypeId } = req.body;
  
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
      const limit = req.body.limit || 20;
      const skip = req.body.skip || 0;
        
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
      let { carModelId } = req.body;

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
      let { carModelId, name, carTypeId } = req.body;
  
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
      const limit = req.body.limit || 20;
      const skip = req.body.skip || 0;
        
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

module.exports = {
  userActions,
  serviceActions,
  agentActions,
  sharedActions,
  accidentActions,
  carTypeActions,
  carModelActions,
  carActions,
};