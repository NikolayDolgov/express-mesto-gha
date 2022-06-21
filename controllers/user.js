const mongoose = require('mongoose');
const User = require('../models/user');
let ERROR_CODE = 500;
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

module.exports.getUser = (req, res) => { // получаем пользователей
  User.find({})
      .then(user => res.send({ data: user }))
      .catch((err) => {
        return res.status(ERROR_CODE).send({message: 'Ошибка по умолчанию.'});
      })
};

module.exports.postUser = (req, res) => { // добавляем пользователя
  const {name, about, avatar} = req.body;
  User.create({name: name, about: about, avatar: avatar})
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      else {
        return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    }
    );
};

module.exports.getUserId = (req, res) => { // получаем пользователя
  User.findById(req.params.userId)
      .then(user => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'CastError') {
          ERROR_CODE = 404;
          return res.status(ERROR_CODE).send({ message: `Пользователь по указанному ${req.params.userId} не найден.` });
        }
        else {
          return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
        }
      }
      );
};

module.exports.patchUser = (req, res) => { // обновляем пользователя кроме аватара
  const {name, about} = req.body;
  User.findByIdAndUpdate(
    req.user.userId,
    { name: name, about: about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      //upsert: true // если пользователь не найден, он будет создан
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      else if (err.name === 'CastError') {
        ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: `Пользователь по указанному ${req.user.userId} не найден.` });
      }
      else {
        return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }); //err/*'Ошибка по умолчанию.'*/
      }
    }
    );
};

module.exports.patchUserAvatar = (req, res) => { // обновляем пользователя/ имя / автар / и т.д.
  const {avatar} = req.body;
  User.findByIdAndUpdate(
    req.user.userId,
    { avatar: avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      else if (err.name === 'CastError') {
        ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: `Пользователь по указанному ${req.user.userId} не найден.` });
      }
      else {
        return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }); //err/*'Ошибка по умолчанию.'*/
      }
    }
    );
};