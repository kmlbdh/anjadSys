'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsTo(models.InsurancePolicy,  { 
        foreignKey: 'insurancePolicyId',
        allowNull: true,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Account.belongsTo(models.User,  { 
        foreignKey: 'agentId',
        as: 'Agent',
        allowNull: true,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Account.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    credit: {
      type: DataTypes.DECIMAL,
    },
    debit: {
      type: DataTypes.DECIMAL,
    },
    note: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};