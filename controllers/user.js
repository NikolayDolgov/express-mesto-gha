const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_CODE, ERROR_CODE_UNDEFINED, ERROR_CODE_INCORRECT } = require('../utils/utils');
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

module.exports.getUser = (req, res) => { // получаем пользователей
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.postUser = (req, res) => { // добавляем пользователя
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUserId = (req, res) => { // получаем пользователя
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        return res.status(ERROR_CODE_UNDEFINED).send({ message: `Пользователь по указанному ${req.params.userId} не найден.` });
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
    req.user.userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        // изменено с 404 на 400 текст был Пользователь по указанному ${req.user.userId} не найден.
        return res.status(ERROR_CODE_INCORRECT).send({ message: `Передан некорректный ${req.user.userId}.` });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.patchUserAvatar = (req, res) => { // обновляем пользователя/ имя / автар / и т.д.
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user.userId,
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
        return res.status(ERROR_CODE_INCORRECT).send({ message: `Передан некорректный ${req.user.userId}.` });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
