const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const Service = db.Service;
const ServiceAccident = db.ServiceAccident;
const ServicePolicy = db.ServicePolicy;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const listSupplierLog = util.debuglog("controller.admin-ListSupplier");

module.exports = {
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

      listSupplierLog(accountSupplier);
      res.status(200).json({data: accountSupplier, total: count});
    } catch(error){
      listSupplierLog(error);
      errorHandler(res, error, "Failed! Account for Supplier wasn't retrieved!");
    }
  }

};