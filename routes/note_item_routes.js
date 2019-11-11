import express from 'express';
import models from 'src/db/models';
import { authenticateStrict } from 'src/services/authentication';

const router = express.Router();

router.get('/for-notebook/:notebookId', authenticateStrict(), getNoteItems);
router.post('/', authenticateStrict(), createNoteItem);
router.patch('/:noteItemId', authenticateStrict(), updateNoteItem);
router.post('/insert-before', authenticateStrict(), insertBefore);
router.post('/insert-after', authenticateStrict(), insertAfter);

export default router;

async function getNoteItems(req, res) {
  const { userId, notebookId } = req.params;

  try {
    const noteItems = await models.noteItems.getAllForNotebook({ userId, notebookId });
    res.json({ noteItems, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: 'fail', message: 'Cant get note items', error: e });
  }
}

async function createNoteItem(req, res) {
  const { userId } = req;
  const { noteItem } = req.body;
  noteItem.userId = userId;

  try {
    const newNoteItem = await models.noteItems.createStd({ noteItem });
    res.json({ noteItem: newNoteItem, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(422).json({ status: 'fail', message: 'Cant create note item', error: e });
  }
}

async function updateNoteItem(req, res) {
  const { noteItemId } = req.params;
  const { noteItem } = req.body;

  try {
    const updatedNoteItem = await models.noteItems.updateStd({ noteItem, noteItemId });
    res.json({ noteItem: updatedNoteItem, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(422).json({ status: 'fail', message: 'Cant update note item', error: e });
  }
}

async function insertBefore(req, res) {
  const { originalNoteItemId, noteItem } = req.body;

  try {
    const newNoteItem = await models.noteItems.insertBefore({ noteItem, originalNoteItemId });
    res.json({ noteItem: newNoteItem, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(422).json({ status: 'fail', message: 'Cant insert note item before', error: e });
  }
}

async function insertAfter(req, res) {
  const { originalNoteItemId, noteItem } = req.body;

  try {
    const newNoteItem = await models.noteItems.insertAfter({ noteItem, originalNoteItemId });
    res.json({ noteItem: newNoteItem, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(422).json({ status: 'fail', message: 'Cant insert note item after', error: e });
  }
}
