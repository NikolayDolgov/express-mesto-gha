const router = require('express').Router();
const {
  getUserAll, getUser, getUserId, patchUser, patchUserAvatar,
} = require('../controllers/user');

router.get('/users', getUserAll);
router.get('/users/me', getUser);

router.get('/users/:userId', getUserId);

router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;
