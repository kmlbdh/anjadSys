'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServicePolicy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ServicePolicy.belongsTo(models.InsurancePolicy, { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ServicePolicy.belongsTo(models.Service, { 
        foreignKey: 'serviceId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ServicePolicy.belongsTo(models.User, { 
        foreignKey: 'supplierId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  ServicePolicy.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    cost: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    additionalDays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize,
    modelName: 'ServicePolicy',
  });
  return ServicePolicy;
};