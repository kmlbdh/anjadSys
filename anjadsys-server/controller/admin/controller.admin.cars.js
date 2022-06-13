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

const updateCarLog = util.debuglog("controller.admin-UpdateCar");
const addCarLog = util.debuglog("controller.admin-AddCar");
const deleteCarLog = util.debuglog("controller.admin-DeleteCar");
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
      deleteCarLog(error);
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
        updateCarLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'carId')
          updateData[val[0]] = val[1];
      });
      updateCarLog(updateData, query);

      const updatedCar = await Car.update(updateData, query);
      updateCarLog(updatedCar[0]);

      if(updatedCar[0]!== 1) 
        throw new customError("Failed! Car isn't updated!", INTERR);

      res.status(200).json({message: "Car was updated successfully!", data: updatedCar[0]});

    } catch(error) {
      updateCarLog(error);
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
  
      listCarLog(query);
      res.status(200).json({data: Cars, total: count});
    } catch(error) {
      listCarLog(error);
      errorHandler(res, error, "Failed! can't get Cars!");
    }
  },
};