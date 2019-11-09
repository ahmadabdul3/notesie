import models from 'src/db/models';

export default function(sequelize, DataTypes) {
  const NoteItemModel = sequelize.define('noteItems', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
    },
    noteText: DataTypes.TEXT,
    formatting: DataTypes.TEXT,
    notebookId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.UUID,
    },
    status: DataTypes.TEXT,
    order: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    deleted: DataTypes.BOOLEAN,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {});

  NoteItemModel.associate = function(models) {
    // associations can be defined here
  };

  NoteItemModel.getAllForNotebook = async ({ userId, notebookId }) => {
    // - first ensure the notebookId belongs to the right user
    // - skipping this step for now ^^^
    const noteList = await NoteItemModel.findAll({
      where: { notebookId },
      order: [
        ['order', 'DESC']
      ],
      limit: 50,
    });

    return noteList.reverse();
  };

  NoteItemModel.createStd = async ({ noteItem }) => {
    const { notebookId } = noteItem;
    const order = await NoteItemModel.count({
      where: { notebookId },
    });
    noteItem.order = order + 1;

    return NoteItemModel.create(noteItem);
  };

  NoteItemModel.updateStd = async ({ noteItem, noteItemId }) => {
    // - delete the id field if it exists, we dont want to accidentally
    //   overrite the id
    delete noteItem.id;
    let updateResponse = await NoteItemModel.update(noteItem, {
      where: { id: noteItemId },
      returning: true,
    });
    return updateResponse[1][0];
  };

  NoteItemModel.insertBefore = async ({ noteItem, orderOfOriginalNoteItem }) => {
    noteItem.order = orderOfOriginalNoteItem;
    return NoteItemModel.insertItem({ noteItem });
  };

  NoteItemModel.insertAfter = async ({ noteItem, orderOfOriginalNoteItem }) => {
    noteItem.order = orderOfOriginalNoteItem + 1;
    return NoteItemModel.insertItem({ noteItem });
  };

  NoteItemModel.insertItem = async ({ noteItem }) => {
    const { Op } = models.Sequelize;
    let transaction;

    try {
      transaction = await models.sequelize.transaction();
      await NoteItemModel.increment('order', { where: {
        order: { [Op.gte]: noteItem.order },
        notebookId: noteItem.notebookId,
      }});
      const newNoteItem = await NoteItemModel.create(noteItem);
      await transaction.commit();
      return newNoteItem;
    } catch (e) {
      if (transaction) await transaction.rollback();
      throw(e);
    }
  };

  return NoteItemModel;
};
