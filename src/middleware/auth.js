const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');


module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('Access attempt without token');
    next(new UnauthorizedError('Authorization required. No token'));
    return;
  }
  const token = authorization.replace('Bearer ','');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log('Token verification error');
    next(new UnauthorizedError('Authorization required. Token invalid'));
    return;
  }
  req.user = payload;
  next();
}