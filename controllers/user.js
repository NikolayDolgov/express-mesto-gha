const mongoose = require('mongoose');
const User = require('../models/user');
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

/*В каждом роуте понадобится _id пользователя, совершающего операцию. Получайте его из req.user._id*/
/* добавить ответы
{
    "name": "Стас",
    "about": "Разработчик",
    "avatar": "https://arte1.ru/images/detailed/4/23608.jpg",
    "_id":"dd8b6dea22fe4ea0ad5d46f4",
}
*/

// добавить обработку ошибок разных //500 — Ошибка по умолчанию.

module.exports.getUser = (req, res) => { // получаем пользователей
  User.find({})
      .then(user => res.send({ data: user }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => { // получаем пользователя
  console.log(req.user.userId)
  User.findById(req.params.userId)
      .then(user => res.send({ data: user }))
      .catch(err => res.status(404).send({ message: `Пользователь по указанному ${req.params.userId} не найден.` }));
};

module.exports.patchUser = (req, res) => { // обновляем пользователя/ имя / автар / и т.д.
  const {name} = req.body;
  console.log(req.user.userId);
  User.findByIdAndUpdate(req.user.userId,{ name: name })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' })); // три вида ошибок добавить
};

module.exports.patchUserAvatar = (req, res) => { // обновляем пользователя/ имя / автар / и т.д.
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user.userId,{ avatar: avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' })); // три вида ошибок добавить
};

module.exports.postUser = (req, res) => { // добавляем пользователя
  const {name, about, avatar} = req.body;
  User.create({name: name, about: about, avatar: avatar})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }));
};