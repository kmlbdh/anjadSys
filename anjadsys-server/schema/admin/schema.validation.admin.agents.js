const Joi = require("joi");

const agentSchema = {
  add: Joi.object().keys({ //TODO no table for agent limits
    debit: Joi.number().min(1).required(),
    agentID: Joi.string().trim().min(9).max(9).required()
  }),
  agentLimitID: Joi.any().required(),
  list: Joi.object().keys({
    accountId: Joi.number().optional(),
    agentID: Joi.string().trim().min(9).max(9).optional(),
    main: Joi.boolean().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = agentSchema;