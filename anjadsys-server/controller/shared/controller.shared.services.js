const db = require("../../models");
const util = require("util");
const errorHandler = require("../../classes/errorhandler");

//debugging NOT FOR PRODUCTION 
const listServicesLog = util.debuglog("controller.ListService");

const Service = db.Service;

module.exports = {
  list: async(res, query, skip, limit) => {
    try{
      query = { ...query, 
        order: [['id', 'ASC' ]],
        offset: skip,
        limit: limit,
      };
      const { count , rows: services} = await Service.findAndCountAll(query);

      listServicesLog(services);
      res.status(200).json({data: services, total: count});
    } catch(error){
      listServicesLog(error);
      errorHandler(res, error, "Failed! Can't get services!");
    }
  },
}