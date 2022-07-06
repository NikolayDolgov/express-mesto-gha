const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserAll, getUser, getUserId, patchUser, patchUserAvatar,
} = require('../controllers/user');

router.get('/users', getUserAll);
router.get('/users/me', getUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserId);

router.patch('/users/me', celebrate({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
}), patchUser);

router.patch('/users/me/avatar', celebrate({
  avatar: Joi.string(),
}), patchUserAvatar);

module.exports = router;
