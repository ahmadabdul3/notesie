'use strict';
export default function (sequelize, DataTypes) {
  const NotebooksModel = sequelize.define('notebooks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {});

  NotebooksModel.associate = function(models) {
    // associations can be defined here
  };

  return NotebooksModel;
};
