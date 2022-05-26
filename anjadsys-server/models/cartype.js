'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CarType.hasMany(models.CarModel, { 
        foreignKey: 'carTypeId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      CarType.hasMany(models.Car, { 
        foreignKey: 'carTypeId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  CarType.init({
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'CarType',
    timestamps: false
  });
  return CarType;
};