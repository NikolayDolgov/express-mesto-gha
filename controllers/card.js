const mongoose = require('mongoose');
const Card = require('../models/card');
let ERROR_CODE = 500;
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

module.exports.likeCard = (req, res) => {
  console.log(req.user.userId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } }, // добавить _id в массив, если его там нет
    { new: true },)
    .then((card) => {
      if(card == null){
        ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: `Передан несуществующий ${req.params.cardId} карточки.` });
      }
      else {
        return res.send({ data: card })
      }
      })
    .catch((err) => {
      if (err.name === 'CastError') {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      else {
        return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    }
    )
  };

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.userId } }, // убрать _id из массива
  { new: true },)
  .then((card) => {
    if(card == null){
      ERROR_CODE = 404;
      return res.status(ERROR_CODE).send({ message: `Передан несуществующий ${req.params.cardId} карточки.` });
    }
    else {
      return res.send({ data: card })
    }}
    )
  .catch((err) => {
    if (err.name === 'CastError') {
      ERROR_CODE = 400;
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    else {
      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    }
  }
  );

module.exports.getCard = (req, res) => { // получаем карточки?
  Card.find({})
      .then(card => res.send({ data: card }))
      .catch((err) => {
        return res.status(ERROR_CODE).send({message: 'Ошибка по умолчанию.'});
      });
};

module.exports.postCard = (req, res) => { // добавляем карточку
  const {name, link} = req.body;
  Card.create({name: name, link: link, owner: req.user.userId})
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      else {
        return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    }
    );
};

module.exports.deleteCard = (req, res) => { // удаляем карточку
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) =>{
      if(card == null){
      ERROR_CODE = 404;
      return res.status(ERROR_CODE).send({ message: `Передан несуществующий ${req.params.cardId} карточки.` });
    }
    else {
      return res.send({ data: card })
    }})
    .catch((err) => {
      if (err.name === 'CastError') {
        ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({ message: `Карточка с указанным ${req.params.cardId} не найдена.` });
      }
      else {
        return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
      }
    }
    );
};