import express from 'express';
import models from 'src/db/models';
import { createJwt } from 'src/services/jwt_manager';
import { authenticateStrict } from 'src/services/authentication';
import {
  isSequelizeError,
  makeErrorsFriendly,
} from 'src/services/sequelize_error_transformer';

const router = express.Router();

/* GET users listing. */
router.get('/', authenticateStrict(), getUser);
router.post('/', createUser);
router.patch('/', authenticateStrict(), patchUser);

export default router;

async function getUser(req, res) {
  if (req.user) {
    res.json({
      status: 'success',
      message: 'good stuff',
      user: models.users.prepForUi({ user: req.user }),
    });
    return;
  }

  res.status(404).json({
    status: 'error',
    message: 'User not found',
  });
}

async function createUser(req, res) {
  let transaction;

  try {
    transaction = await models.sequelize.transaction();
    const { user } = req.body;
    const newUser = await models.users.createStd({ user, transaction });
    const token = await createJwt({ payload: { sub: newUser.id } });
    await transaction.commit();

    res.json({
      status: 'success',
      message: 'yayers',
      user: newUser,
      token,
    });
  } catch (e) {
    if (transaction) await transaction.rollback();
    console.log('e', e);

    let friendlyMessage = `We're sorry, but there was an error. Please try again.`;
    if (isSequelizeError(e)) friendlyMessage = makeErrorsFriendly(e).message;
    else if (e.friendlyMessage) friendlyMessage = e.friendlyMessage;

    res.status(422).json({
      status: 'error',
      message: 'Could not create user',
      friendlyMessage: friendlyMessage,
      error: e,
    });
  }
}

async function patchUser(req, res) {
  const { user } = req.body;
  const userId = req.user.id;
  let updatedUser;
  models.users.update(user, { where: { id: userId }, returning: true }).then(userRes => {
    updatedUser = userRes[1] && userRes[1][0];
    updatedUser = updatedUser && models.users.prepForUi({ user: updatedUser });
    res.json({
      status: 'success',
      message: 'good stuff',
      user: updatedUser,
    });
  }).catch(e => {
    console.log('=== ERROR START = folder:routes file:users.js method:updateUser ===');
    console.log(e);
    console.log('=== ERROR END ===');
    let friendlyMessage;
    if (e.friendlyMessage) friendlyMessage = e.friendlyMessage;
    else if (isSequelizeError(e)) friendlyMessage = makeErrorsFriendly(e).message;
    else friendlyMessage = `We were not able to update your information, please try again.`;

    res.status(422).json({
      status: 'error',
      message: 'Could not patch user',
      friendlyMessage: friendlyMessage,
      error: e,
    });
  });
}

async function updatePassword(req, res) {
  const { passwords } = req.body;
  const userId = req.user.id;
  models.users.updatePassword({ passwords }).then(passwordRes => {
    res.json({
      status: 'success',
      message: 'good stuff',
      friendlyMessage: 'Your password has been updated!',
    });
  }).catch(e => {
    console.log('=== ERROR START = folder:routes file:users.js method:updatePassword ===');
    console.log(e);
    console.log('=== ERROR END ===');

    let friendlyMessage;
    if (e.friendlyMessage) friendlyMessage = e.friendlyMessage;
    else if (isSequelizeError(e)) friendlyMessage = makeErrorsFriendly(e).message;
    else friendlyMessage = `We were not able to update your information, please try again.`;

    res.status(422).json({
      status: 'error',
      message: 'Could not update password',
      friendlyMessage: friendlyMessage,
      error: e,
    });
  });
}
