import express from 'express';
import path from 'path';
import userRoutes from 'src/routes/user_routes';
import sessionRoutes from 'src/routes/session_routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);

// send all requests to index.html so browserHistory in React Router works
router.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.pug');
  res.render(path.resolve(filePath));
});

export default router;
