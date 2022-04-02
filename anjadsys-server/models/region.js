'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    static associate(models) {
      Region.hasMany(models.User, { 
        foreignKey: 'regionId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }); 
      Region.hasMany(models.Accident, { 
        foreignKey: 'regionId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Region.init({
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Region',
    timestamps: false
  });
  return Region;
};