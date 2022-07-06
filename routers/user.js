const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserAll, getUser, getUserId, patchUser, patchUserAvatar,
} = require('../controllers/user');

const regex = /https?:\/\/[w{3}]?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]{1,}/;

router.get('/users', getUserAll);
router.get('/users/me', getUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserId);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
}), patchUserAvatar);

module.exports = router;
