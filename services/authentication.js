import jwt from 'jsonwebtoken';
import models from 'src/db/models';

const ERROR_NO_AUTH_HEADER = 'NoAuthHeader';
const ERROR_TOKEN_EXPIRED = 'TokenExpiredError';
const ERROR__USER__MISSING = 'error--user--missing';


export function authenticateLenient(allowedClaims) {
  return async function (req, res, next) {
    try {
      const token = await authenticate(req, res);
      await loadUser({ req, token, allowedClaims });
      next();
    } catch (response) {
      console.log('ERROR', response);

      if (response.error.name === ERROR_TOKEN_EXPIRED) {
        await handleLenientTokenExpired({ req, res, next, allowedClaims });
        return;
      }

      res.status(401).json({ message: 'Forbidden' });
      return;
    }
  };
}

async function handleLenientTokenExpired({ req, res, next, allowedClaims }) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    await loadUser({ req, token: { decoded}, allowedClaims });
    next();
  } catch (e) {
    console.log('error handle lenient', e);
    res.status(401).json({ message: 'Forbidden' });
  }
}

export function authenticateStrict(allowedClaims) {
  return async function(req, res, next) {
    try {
      const token = await authenticate(req, res);
      await loadUser({ req, token, allowedClaims });
      next();
    } catch (response) {
      console.log('ERROR ', response);
      res.status(401).json({ message: 'Forbidden' });
      return;
    }
  };
}

export function getUserFromAuthToken({ req }) {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token);
  return fetchUser({ id: decoded.sub });
}

async function loadUser({ req, token, allowedClaims }) {
  const user = await fetchUser({ id: token.decoded.sub });
  if (!user) throw({ name: ERROR__USER__MISSING, message: 'User not found' });
  validateUser({ user, allowedClaims });
  req.userId = token.decoded.sub;
  req.user = user;
}

function fetchUser({ id }) {
  return models.users.findOne({ where: { id }});
}

function validateUser({ user, allowedClaims }) {
  if (user.claims.banned) throw(BannedUserError());
  if (!allowedClaims || !allowedClaims.length) return;
  allowedClaims.forEach(claim => {
    if (!user.claims[claim]) throw(ClaimMissingError({ claim }));
  });
}

function authenticate(req, res) {
  return new Promise((resolve, reject) => {
    const { authorization } = req.headers;

    if (!authorization) {
      reject({ error: { message: 'user not logged in', name: ERROR_NO_AUTH_HEADER }});
      return;
    }

    const token = authorization.split(' ')[1];
    const cert = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
    jwt.verify(token, cert, { algorithms: ['RS256'] }, (error, decoded) => {
      console.log('decoded', decoded);
      if (error) reject({ error, decoded });
      else resolve({ error, decoded });
    });
  });
}

function ClaimMissingError({ claim }) {
  return { error: { message: 'Forbidden', name: 'claimMissing' } };
}

function BannedUserError() {
  return { error: { message: 'Forbidden', name: 'bannedUser' } };
}
