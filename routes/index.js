import express from 'express';
import path from 'path';
import userRoutes from 'src/routes/user_routes';
import sessionRoutes from 'src/routes/session_routes';
import notebookRoutes from 'src/routes/notebook_routes';
import noteItemRoutes from 'src/routes/note_item_routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/notebooks', notebookRoutes);
router.use('/note-items', noteItemRoutes);

// send all requests to index.html so browserHistory in React Router works
router.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.pug');
  res.render(path.resolve(filePath));
});

export default router;
