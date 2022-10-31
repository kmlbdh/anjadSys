'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.hasMany(models.ServiceAccident, { 
        foreignKey: 'serviceId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Service.hasMany(models.ServicePolicy, { 
        foreignKey: 'serviceId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Service.init({
    id: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    cost: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    coverageDays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    supplierPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    packageType: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};