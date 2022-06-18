const router = require('express').Router();
const mongoose = require('mongoose');
const userSchema = require('../models/user');
const cardSchema = require('../models/card');
const fs = require('fs/promises');
const path = require('path');
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

router.get('/cards', (req, res) => {
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из get космоса</p>
  </body>
  </html>`);
});

router.get('/cards/:cardId', (req, res) => {
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из getId космоса</p>
  </body>
  </html>`);
});

/*В каждом роуте понадобится _id пользователя, совершающего операцию. Получайте его из req.user._id*/

router.put('/cards/:cardId/likes', (req, res) => { // поставить лайк карточке

  /*
  module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
  )



  module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
  )
  */
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из getId космоса</p>
  </body>
  </html>`);
});

router.delete('/cards/:cardId/likes', (req, res) => { // убрать лайк с карточки
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из getId космоса</p>
  </body>
  </html>`);
});

router.post('/cards', (req, res) => {
  const {name, link} = req.body;
  //const name = "named";
  //const about = "about";
  cardSchema.create({name: name, link: link})
    // вернём записанные в базу данные
    //.then(user => res.send({ data: user }))
    .then(card => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send(err));
});

module.exports = router;


// пункт обработка ошибок - добавить