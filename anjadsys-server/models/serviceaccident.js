'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceAccident extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ServiceAccident.belongsTo(models.Accident, { 
        foreignKey: 'accidentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ServiceAccident.belongsTo(models.Service, { 
        foreignKey: 'serviceId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ServiceAccident.belongsTo(models.User, { 
        foreignKey: 'supplierId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  ServiceAccident.init({
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
    modelName: 'ServiceAccident',
  });
  return ServiceAccident;
};