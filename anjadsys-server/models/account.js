'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.belongsTo(models.InsurancePolicy,  { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Account.belongsTo(models.User,  { 
        foreignKey: 'agentId',
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