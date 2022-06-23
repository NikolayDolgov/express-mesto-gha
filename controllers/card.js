const Card = require('../models/card');
const { ERROR_CODE, ERROR_CODE_UNDEFINED, ERROR_CODE_INCORRECT } = require('../utils/utils');

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user.userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        return res.status(ERROR_CODE_UNDEFINED).send({ message: `Передан несуществующий ${req.params._id} карточки.` });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params._id,
  { $pull: { likes: req.user.userId } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card == null) {
      return res.status(ERROR_CODE_UNDEFINED).send({ message: `Передан несуществующий ${req.params._id} карточки.` });
    }

    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }

    return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
  });

module.exports.getCard = (req, res) => { // получаем карточки
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.postCard = (req, res) => { // добавляем карточку
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user.userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => { // удаляем карточку
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (card == null) {
        return res.status(ERROR_CODE_UNDEFINED).send({ message: `Передан несуществующий ${req.params._id} карточки.` });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT).send({ message: `Карточка с указанным ${req.params._id} не найдена.` });
      }

      return res.status(ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
