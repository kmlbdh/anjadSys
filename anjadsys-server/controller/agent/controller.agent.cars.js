const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const User = db.User;
const Role = db.Role;
const Car = db.Car;
const CarModel = db.CarModel;
const CarType = db.CarType;
const Region = db.Region;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const addCarLog = util.debuglog("controller.agent-AddCar");
const listCarLog = util.debuglog("controller.admin-ListCar");

module.exports = {
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
  
      listCarLog(query);
      res.status(200).json({data: Cars, total: count});
    } catch(error) {
      listCarLog(error);
      errorHandler(res, error, "Failed! can't get Cars!");
    }
  },
};