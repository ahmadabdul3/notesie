import express from 'express';
import models from 'src/db/models';
import { authenticateStrict } from 'src/services/authentication';

const router = express.Router();

router.get('/', authenticateStrict(), getNotebooks);
router.post('/', authenticateStrict(), createNotebook);

export default router;

async function getNotebooks(req, res) {
  const { userId } = req;

  try {
    const notebooks = await models.notebooks.getAllForUser({ userId });
    res.json({ notebooks, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: 'fail', message: 'Cant get notebooks', error: e });
  }
}

async function createNotebook(req, res) {
  console.log('create notebook', req.userId);
  const { userId } = req;
  const { notebook } = req.body;
  notebook.userId = userId;

  try {
    const newNotebook = await models.notebooks.createStd({ notebook });
    res.json({ notebook: newNotebook, status: 'success', message: 'success' });
  } catch (e) {
    console.log(e);
    res.status(422).json({ status: 'fail', message: 'Cant create notebook', error: e });
  }
}
