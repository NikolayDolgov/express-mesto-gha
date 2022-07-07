const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const { regex } = require('../utils/utils');

router.get('/cards', getCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(regex).required(),
  }),
}), postCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
