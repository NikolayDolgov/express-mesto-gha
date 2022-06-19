const router = require('express').Router();
const {getCard, postCard, deleteCard, likeCard, dislikeCard} = require('../controllers/card');

router.get('/cards', getCard);
router.get('/cards/:cardsId', getCard);

router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

router.post('/cards', postCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;