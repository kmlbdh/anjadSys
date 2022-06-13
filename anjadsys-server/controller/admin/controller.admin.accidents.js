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

const deleteAccidentLog = util.debuglog("controller.admin-deleteAccident");
const addAccidentLog = util.debuglog("controller.admin-addAccident");
const updateAccidentLog = util.debuglog("controller.admin-UpdateAccident");
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
      deleteAccidentLog(error);
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
        updateAccidentLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'accidentID' && val[0] !== 'services')
          updateData[val[0]] = val[1];
      });

      updateAccidentLog(updateData);
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
      
  
      updateAccidentLog(deletedServiceAccident);
      res.status(200).json({
        message: "Accident was updated successfully!", 
        data: {
          accident: updatedAccident[0],
          serviceAccidents: updateServiceAccidents[0],
          deletedServiceAccidents: deletedServiceAccident
        }
      });
    } catch(error) {
      updateAccidentLog(error);
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
      
      listAccidentLog(query);
      res.status(200).json({data: Accidents, total: count});
    } catch(error) {
      listAccidentLog(error);
      errorHandler(res, error, "Failed! can't get Accidents!");
    }
  },
};