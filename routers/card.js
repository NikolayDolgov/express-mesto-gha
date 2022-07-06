const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

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
  name: Joi.string().min(2).max(30),
  link: Joi.string(),
}), postCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
