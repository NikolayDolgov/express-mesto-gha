const Card = require('../models/card');
const IncorrectError = require('../errors/IncorrectError');
const UndefinedError = require('../errors/UndefinedError');
const DefaultError = require('../errors/DefaultError');

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        next(new UndefinedError(`Передан несуществующий ${req.params.cardId} карточки.`));
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectError('Переданы некорректные данные для постановки лайка'));
      }

      next(new DefaultError());
    });
};

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card == null) {
      next(new UndefinedError(`Передан несуществующий ${req.params._id} карточки.`));
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные для снятия лайка'));
    }

    next(new DefaultError());
  });

module.exports.getCard = (req, res, next) => { // получаем карточки
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.postCard = (req, res, next) => { // добавляем карточку
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectError('Переданы некорректные данные при создании карточки.'));
      }

      next(new DefaultError());
    });
};

module.exports.deleteCard = (req, res, next) => { // удаляем карточку
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card == null) {
        next(new UndefinedError(`Передан несуществующий ${req.params._id} карточки.`));
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectError(`Карточка с указанным ${req.params._id} не найдена.`));
      }

      next(new DefaultError());
    });
};
