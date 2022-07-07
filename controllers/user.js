const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const IncorrectError = require('../errors/IncorrectError');
const AuthentificationError = require('../errors/AuthentificationError');
const UndefinedError = require('../errors/UndefinedError');
const UniqueError = require('../errors/UniqueError');
const DefaultError = require('../errors/DefaultError');

module.exports.getUserAll = (req, res, next) => { // получаем пользователей
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => { // получаем пользователя // доделать
  User.findById(req.user._id)
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => { // получаем пользователя
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        throw new UndefinedError(`Пользователь по указанному ${req.params.userId} не найден.`);
      }

      return res.send({
        data: user,
      });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectError('Передан некорректный _id'));
      }
      next();
    });
};

module.exports.patchUser = (req, res, next) => { // обновляем пользователя кроме аватара
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
      return res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'CastError') {
        return next(new IncorrectError(`Передан некорректный ${req.user._id}.`));
      }

      next(new DefaultError());
    });
};

module.exports.patchUserAvatar = (req, res, next) => { // обновляем пользователя
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
  )
    .then((user) => {
      // eslint-disable-next-line no-param-reassign
      user.avatar = avatar;
      return res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'CastError') {
        // изменено с 404 на 400 текст был Пользователь по указанному ${req.user.userId} не найден.
        return next(new IncorrectError(`Передан некорректный ${req.user._id}.`));
      }

      next(new DefaultError());
    });
};

module.exports.login = (req, res, next) => { // авторизация
  const { email, password } = req.body;
  let newUser;
  User.findOne({
    email,
  }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new AuthentificationError('Неправильный логин или пароль');
      }
      newUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((pass) => {
      if (!pass) {
        throw new AuthentificationError('Неправильный логин или пароль');
      }

      // создадим токен
      const token = jwt.sign({ _id: newUser._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => { // добавляем пользователя /signup
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const password = hash;
      User.create({
        name, about, avatar, email, password,
      })
        .then((user) => res.send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          },
        }))
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new IncorrectError('Переданы некорректные данные при создании пользователя.'));
          }
          if (err.code === 11000) {
            return next(new UniqueError(`Указанный вами ${email} уже занят другим пользователем.`));
          }
          next(new DefaultError());
        });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при создании пользователя.'));
      }

      next(new DefaultError());
    });
};
