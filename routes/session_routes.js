import express from 'express';
import models from 'src/db/models';
import { createJwt } from 'src/services/jwt_manager';
import { authenticateStrict } from 'src/services/authentication';

const router = express.Router();

router.post('/', login);

export default router;

async function login(req, res) {
  try {
    const { email, password } = req.body.session;
    const user = await models.users.fetchWithCredentials({ email, password });
    const token = await createJwt({ payload: { sub: user.id } });
    res.json({
      status: 'success',
      message: 'yayers',
      user,
      token,
    });
  } catch (e) {
    console.log('e', e);
    res.status(401).json({
      status: 'error',
      message: 'There was an error',
      friendlyMessage: e.friendlyMessage || 'Invalid email or password',
    });
  }
}
