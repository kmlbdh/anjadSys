const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const User = db.User;
const Role = db.Role;
const Service = db.Service;
const Accident = db.Accident;
const Car = db.Car;
const CarModel = db.CarModel;
const CarType = db.CarType;
const Region = db.Region;
const ServiceAccident = db.ServiceAccident;
const sequelizeDB = db.sequelize;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const addAccidentLog = util.debuglog("controller.admin-addAccident");
const listAccidentLog = util.debuglog("controller.admin-ListAccident");

module.exports = {
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
  
      listAccidentLog(query);
      res.status(200).json({data: Accidents, total: count});
    } catch(error) {
      listAccidentLog(error);
      errorHandler(res, error, "Failed! can't get Accidents!");
    }
  },
};