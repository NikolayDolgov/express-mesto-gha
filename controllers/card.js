const Card = require('../models/card');
const IncorrectError = require('../errors/IncorrectError');
const UndefinedError = require('../errors/UndefinedError');
const DefaultError = require('../errors/DefaultError');
const NoAccessError = require('../errors/NoAccessError');

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        return next(new UndefinedError(`Передан несуществующий ${req.params.cardId} карточки.`));
      }

      return res.send({ data: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectError('Переданы некорректные данные для постановки лайка'));
      }

      next(new DefaultError());
    });
};

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card == null) {
      return next(new UndefinedError(`Передан несуществующий ${req.params.cardId} карточки.`));
    }

    return res.send({ data: card });
  })
  // eslint-disable-next-line consistent-return
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new IncorrectError('Переданы некорректные данные для снятия лайка'));
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
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при создании карточки.'));
      }

      next(new DefaultError());
    });
};

module.exports.deleteCard = (req, res, next) => { // удаляем карточку
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new UndefinedError(`Передан несуществующий ${req.params.cardId} карточки.`);
      }
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((newCard) => res.send({ data: newCard }))
          .catch(next);
      } else {
        throw new NoAccessError('У Вас нет доступа для удаления данной карточки.');
      }
    })
    .catch(next);
};
