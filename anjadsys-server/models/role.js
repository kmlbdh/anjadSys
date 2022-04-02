'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { 
        foreignKey: 'roleId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Role.init({
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING(50),
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false
  });
  return Role;
};