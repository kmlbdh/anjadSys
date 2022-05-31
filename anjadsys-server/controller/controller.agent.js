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
const listUsersLog = util.debuglog("controller.agent-ListUsers");
const lightListUsersLog = util.debuglog("controller.agent-LightListUsers");
const createUserLog = util.debuglog("controller.agent-CreateUser");
const addCarLog = util.debuglog("controller.agent-AddCar");
const addAccidentLog = util.debuglog("controller.agent-AddAccident");
const addInsurancePolicyLog = util.debuglog("controller.agent-addInsurancePolicy");
const listCarsLog = util.debuglog("controller.agent-ListCars");
const listServicesLog = util.debuglog("controller.agent-ListServices");
const listAccidentsLog = util.debuglog("controller.agent-ListAccidents");
const listAccountsLog = util.debuglog("controller.agent-ListAccounts");
const listInsurancePoliciesLog = util.debuglog("controller.agent-listInsurancePolicies");
const listCarTypesLog = util.debuglog("controller.agent-listCarTypes");
const listCarModelsLog = util.debuglog("controller.agent-listCarModels");
const listRegionsLog = util.debuglog("controller.agent-listRegions");

const userActions = {
  create: async (req, res) => {
    try {
      const roleName = 'customer';
      const role = await Role.findOne({
        where:{name:{[Op.substring]: roleName}}
      });
  
      if(!role || !role.name)
        throw new customError("Failed! Role isn't exist!", INTERR);
  
      req.body.roleName = role.name;
      req.body.roleId = role.id;
      req.body.agentId = req.agent.id;
      await userShared.createUser(res, req.body);
    } catch(error) {
      createUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  lightList: async(req, res) => {
    try {
      let query = {where: {
        '$Role.name$': 'customer',
        agentId: req.agent.id,
        blocked: false,
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.regionID) query.where.regionId = req.body.regionID;
  
      if (req.body.username) query.where.username = {[Op.substring]: req.body.username};

      if (req.body.userID) query.where.id = req.body.userID;
  
      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
        {
          model: Role,
          required: true,
        }],
        offset: skip,
        limit: limit,
        attributes: ['id', 'username']
      };

      lightListUsersLog(query);
      const { count, rows: users } = await User.findAndCountAll(query);

      res.status(200).json({data: users, total: count});

    } catch(error) {
      lightListUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
  list: async(req, res) => {
    try {
      listUsersLog(req.body.agentID);
      let query = { where: {
        '$Role.name$': 'customer',
        agentId: req.agent.id,
        [Op.or]:[]
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.regionID) query.where.regionId = req.body.regionID;

      if (req.body.blocked !== null && req.body.blocked !== undefined ) query.where.blocked = req.body.blocked;
  
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

      listUsersLog(query);
      await userShared.listUsers(res, query, skip, limit, req.body.agent);
    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
  listSuppliers: async(req, res) => {
    try {
      let query = {where: {
        '$Role.name$': 'supplier',
        blocked: false,
        [Op.or]:[]
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

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

      listUsersLog(query);
      await userShared.listUsers(res, query, skip, limit);
    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Suppliers!");
    }
  }
};

const serviceActions = {
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

      let userexist = await User.findOne({where: {id: customerId, agentId: req.agent.id}});
      addCarLog(userexist);
      if(!userexist || !userexist.id)
        throw new customError("Failed! Customer doesn't exist in your list!", INTERR);

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
      addCarLog(error);
      errorHandler(res, error, "Failed! Car wasn't added!");
    }
  },
  list: async(req, res) => {
    try{
      // where: {'agentId': req.agent.id}
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
            }
          ],
          where: {'agentId': req.agent.id},
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

      if(Object.keys(query.where) === 0) delete query.where;

      const { count, rows: Cars } = await Car.findAndCountAll(query);
  
      listCarsLog(query);
      res.status(200).json({data: Cars, total: count});
    } catch(error) {
      listCarsLog(error);
      errorHandler(res, error, "Failed! can't get Cars!");
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
          agentId: req.agent.id,
          carId,
          regionId
        }, { isNewRecord: true, transaction: t });

        const savedAccident = await accident.save();

        if(!savedAccident || !accident.id)
          throw new customError("Failed! Accident wasn't added!", INTERR);

        let serviceAccidentObj = [];

        services.forEach((service, i) => {
          serviceAccidentObj[i] = {
            coverageDays: service.coverageDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            accidentId: accident.id
          };
        });

        const serviceAccidents = await ServiceAccident.bulkCreate(serviceAccidentObj,
          { transaction: t});
        
        addAccidentLog(serviceAccidents);

        if(serviceAccidents.length === 0)
          throw new customError("Failed! Accident wasn't added!", INTERR);

        res.status(200).json({
          message: "Accident was added successfully!",
          data: {accident: savedAccident.toJSON(), serviceAccidents: serviceAccidents}
        });
      });
    } catch(error) {
      addAccidentLog(error);
      errorHandler(res, error, "Failed! Accident wasn't added!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: { agentId: req.agent.id }};
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
            model: User,
            required: true,
            as: 'Agent',
            include:[
              {
                model: Region,
                required: true
              }
            ],
            attributes: { include: ['companyName', 'username', 'jawwal1', 'jawwal2'] }
          },
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
  
      listAccidentsLog(query);
      res.status(200).json({data: Accidents, total: count});
    } catch(error) {
      listAccidentsLog(error);
      errorHandler(res, error, "Failed! can't get Accidents!");
    }
  },
};

const accountActions = {
  list: async(req, res) => {
    try{
      let query = { where: {}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.accountId) 
        query.where.id = req.body.accountId;

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

      if (!req.body.insurancePolicyId){
        query.where[Op.or] = [{agentId: req.agent.id}, {'$InsurancePolicy.agentId$': req.agent.id}]
      } 

      // if (req.body.customerID)
      //   query.where.customerID = req.body.customerID;
        
      if(Object.keys(query.where) === 0 ) delete query.where;

      if(req.body.insurancePolicyId){
        query = { ...query,
          order: [['id', 'ASC' ]],
          include: [{
            model: InsurancePolicy,
            required: true,
            where: { agentId : req.agent.id, id: req.body.insurancePolicyId }
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
              // where: { agentId: req.agent.id}
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

      const { count, rows: accounts } = await Account.findAndCountAll(query);

      let agentBalance = await agentAccount(req);
  
      listAccountsLog(query);
      res.status(200).json({data: accounts, agentBalance, total: count});
    } catch(error) {
      listAccountsLog(error);
      errorHandler(res, error, "Failed! can't get Accounts!");
    }
  },
};

const insurancePolicyActions = {
  add: async(req, res) => {
    try {
      let {
        totalPrice,
        note,
        expireDate,
        customerId,
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
          agentId: req.agent.id,
          carId,
        }, { isNewRecord: true, transaction: t });

        const savedInsurancePolicy = await insurancePolicy.save();

        if(!savedInsurancePolicy || !insurancePolicy.id)
          throw new customError("Failed! Insurance Policy wasn't added!", INTERR);

        let servicePolicyObj = [];

        services.forEach((service, i) => {
          servicePolicyObj[i] = {
            cost: service.cost,
            additionalDays: service.additionalDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            insurancePolicyId: insurancePolicy.id,
            supplierPercentage: service.supplierPercentage
          };
        });

        const servicesPolicy = await ServicePolicy.bulkCreate(servicePolicyObj,
          { transaction: t});
        
        addInsurancePolicyLog(servicesPolicy);

        if(servicesPolicy.length === 0)
          throw new customError("Failed! Services Policy wasn't added!", INTERR);

        const account = Account.build({
          insurancePolicyId: insurancePolicy.id,
          credit: totalPrice,
        }, { isNewRecord: true, transaction: t });
    
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
      addInsurancePolicyLog(error);
      errorHandler(res, error, "Failed! Insurance Policy wasn't added!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: { agentId: req.agent.id }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.insurancePolicyId) 
        query.where.id = req.body.insurancePolicyId;
     
      // if (req.body.carNumber) 
      //   query.where.carNumber = req.body.carNumber; 
      
      if (req.body.carID) 
        query.where.carId = req.body.carID;

      if (req.body.agentID)
        query.where.agentId = req.body.agentID;

      if (req.body.customerID)
        query.where.customerID = req.body.customerID;

      if(req.body.filterOutValid){
        query.where.expireDate = {[Op.gte]: new Date().setHours(0, 0, 0, 0)}
      }
      
      query = { ...query,
        order: [['id', 'ASC' ]],
        include: [
        {
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

      const { count, rows: insurancePolices } = await InsurancePolicy.findAndCountAll(query);
      
      if(req.body.filterOutValid){
        if(count === 0)
          throw new customError("لا يوجد بوليصة تأمين متاحة او غير منتهية", INTERR);
      }
      
      listInsurancePoliciesLog(query);
      res.status(200).json({data: insurancePolices, total: count});
    } catch(error) {
      listInsurancePoliciesLog(error);
      errorHandler(res, error, "Failed! can't get Insurance Policies!");
    }
  },
};

const carTypeActions = {
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
  
      listCarTypesLog(query);
      res.status(200).json({data: CarTypes, total: count});
    } catch(error) {
      listCarTypesLog(error);
      errorHandler(res, error, "Failed! can't get Car Types!");
    }
  },
};

const carModelActions = {
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
  
      listCarModelsLog(query);
      res.status(200).json({data: carModels, total: count});
    } catch(error) {
      listCarModelsLog(error);
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

      listRegionsLog(regions);
      res.status(200).json({
        message: "Regions were reterived successfully!",
        data: regions
      });   
    } catch(err){
      listRegionsLog(err);
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
}

const statisticsActions = {
  list: async(req, res) => {
    try {
      const customers = await User.count({ where: {roleId: 3, agentId: req.agent.id}});
      const insurancePolicies = await InsurancePolicy.count({ where: {agentId: req.agent.id}});
      const accidents = await Accident.count({ where: { agentId: req.agent.id}});
  
      if(customers == null || insurancePolicies == null || accidents == null) 
        throw new customError("Failed! can't get Statistics!");

      res.status(200).json({
        message: "Statistics were reterived successfully!",
        data: {
          customers,
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

/* ######################### Internal Method ##################### */

const checkLimits = async (req) => {
  const totalDebit = await Account.findAll({
    where: { agentId: req.agent.id },
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
        where: { agentId: req.agent.id },
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
    where: { agentId: req.agent.id },
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
        where: { agentId: req.agent.id },
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

/* ######################### Internal Method ##################### */

module.exports = {
  userActions,
  regionActions,
  serviceActions,
  carActions,
  carModelActions,
  carTypeActions,
  accidentActions,
  insurancePolicyActions,
  accountActions,
  statisticsActions
};