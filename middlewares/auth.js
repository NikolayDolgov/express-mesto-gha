const jwt = require('jsonwebtoken');
const AuthentificationError = require('../errors/AuthentificationError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw next(new AuthentificationError('Токена нет в заголовке'));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (e) {
      return next(new AuthentificationError('Необходима авторизация'));
    }
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
  }
};
