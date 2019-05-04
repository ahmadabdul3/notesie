'use strict';
export default function (sequelize, DataTypes) {
  const NoteDocumentsModel = sequelize.define('noteDocuments', {
    title: DataTypes.STRING
  }, {});

  NoteDocumentsModel.associate = function(models) {
    // associations can be defined here
  };

  return NoteDocumentsModel;
};
