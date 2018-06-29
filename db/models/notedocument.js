'use strict';
module.exports = (sequelize, DataTypes) => {
  var NoteDocument = sequelize.define('NoteDocument', {
    title: DataTypes.STRING
  }, {});
  NoteDocument.associate = function(models) {
    // associations can be defined here
  };
  return NoteDocument;
};
