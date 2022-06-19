const router = require('express').Router();
const {getUser, getUserId, patchUser, patchUserAvatar, postUser} = require('../controllers/user');

router.get('/users', getUser);
router.post('/users', postUser);

router.get('/users/:userId', getUserId);

router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;