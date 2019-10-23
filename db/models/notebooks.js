'use strict';
export default function (sequelize, DataTypes) {
  const NotebooksModel = sequelize.define('notebooks', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
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

  NotebooksModel.getAllForUser = async ({ userId }) => {
    return NotebooksModel.findAll({ where: { userId } });
  };

  NotebooksModel.createStd = async ({ notebook }) => {
    return NotebooksModel.create(notebook);
  };

  return NotebooksModel;
};
