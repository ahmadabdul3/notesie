import express from 'express';
import path from 'path';
const router = express.Router();

// send all requests to index.html so browserHistory in React Router works
router.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.pug');
  res.render(path.resolve(filePath));
});

module.exports = router;
