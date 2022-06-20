const mongoose = require('mongoose');
const Card = require('../models/card');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

module.exports.likeCard = (req, res) => {
  console.log(req.user.userId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } }, // добавить _id в массив, если его там нет
    { new: true },)
  .then(card => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }
));};

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.userId } }, // убрать _id из массива
  { new: true },)
  .then(card => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
;

module.exports.getCard = (req, res) => { // получаем карточку/ки?
  Card.find({})
      .then(card => res.send({ data: card }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.postCard = (req, res) => { // добавляем карточку
  const {name, link} = req.body;
  Card.create({name: name, link: link, owner: req.user.userId})
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err }));
};

module.exports.deleteCard = (req, res) => { // удаляем карточку
  Card.findByIdAndRemove(req.params.cardId)
    .then(user => res.send({ data: user}))
    .catch(err => res.status(500).send({ message: req.params }));
};