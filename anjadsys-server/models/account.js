'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasOne(models.InsurancePolicy_Account,  { 
        foreignKey: 'accountId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Account.hasOne(models.Agent_Account,  { 
        foreignKey: 'accountId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Account.hasOne(models.Supplier_Account,  { 
        foreignKey: 'accountId',
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