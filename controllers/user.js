const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const {
  ERROR_CODE, ERROR_CODE_UNDEFINED, ERROR_CODE_INCORRECT, ERROR_CODE_AUTHENTICATION,
} = require('../utils/utils');

module.exports.getUserAll = (req, res) => { // получаем пользователей
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUser = (req, res) => { // получаем пользователя // доделать
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserId = (req, res) => { // получаем пользователя
  User.findById(req.params._id)
    .then((user) => {
      if (user == null) {
        return res.status(ERROR_CODE_UNDEFINED).send({ message: `Пользователь по указанному ${req.params._id} не найден.` });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Передан некорректный _id' });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.patchUser = (req, res) => { // обновляем пользователя кроме аватара
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      // eslint-disable-next-line no-param-reassign
      user.name = name;
      // eslint-disable-next-line no-param-reassign
      user.about = about;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        // изменено с 404 на 400 текст был Пользователь по указанному ${req.user.userId} не найден.
        return res.status(ERROR_CODE_INCORRECT).send({ message: `Передан некорректный ${req.user._id}.` });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.patchUserAvatar = (req, res) => { // обновляем пользователя/ имя / автар / и т.д.
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
  )
    .then((user) => {
      // eslint-disable-next-line no-param-reassign
      user.avatar = avatar;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        // изменено с 404 на 400 текст был Пользователь по указанному ${req.user.userId} не найден.
        return res.status(ERROR_CODE_INCORRECT).send({ message: `Передан некорректный ${req.user._id}.` });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.login = (req, res) => { // авторизация
  const { email, password } = req.body;
  let newUser;
  User.findOne({
    email,
  }).select('+password')
    .then((user) => {
      if (user == null) {
        return res.status(ERROR_CODE_AUTHENTICATION).send({ message: 'Неправильный логин или пароль f' });
      }
      newUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((pass) => {
      if (!pass) {
        return res.status(ERROR_CODE_AUTHENTICATION).send({ message: 'Неправильный логин или пароль' });
      }

      // создадим токен
      const token = jwt.sign({ _id: newUser._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createUser = (req, res) => { // добавляем пользователя /signup
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const password = hash;
      User.create({
        name, about, avatar, email, password,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при создании пользователя.' });
          }
          return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
