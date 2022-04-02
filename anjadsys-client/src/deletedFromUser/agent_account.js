'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent_Account extends Model {
    static associate(models) {
      Agent_Account.belongsTo(models.User,  { 
        foreignKey: 'userId',
        as: 'Agent',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Agent_Account.belongsTo(models.Account,  { 
        foreignKey: 'accountId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Agent_Account.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'Agent_Account',
    timestamps: false,
  });
  return Agent_Account;
};