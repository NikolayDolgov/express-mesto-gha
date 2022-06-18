const router = require('express').Router();
const mongoose = require('mongoose');
const userSchema = require('../models/user');
const cardSchema = require('../models/card');
const fs = require('fs/promises');
const path = require('path');
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

router.get('/users', (req, res) => {
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из get космоса</p>
  </body>
  </html>`);
});

router.get('/users/:userId', (req, res) => {
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из getId космоса</p>
  </body>
  </html>`);
});

/*В каждом роуте понадобится _id пользователя, совершающего операцию. Получайте его из req.user._id*/
router.patch('/users/me', (req, res) => { // — обновляет профиль
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из getId космоса</p>
  </body>
  </html>`);
});

router.patch('/users/me/avatar', (req, res) => { // — обновляет аватар
  res.send(`<html>
  <body>
      <p>Ответ на сигнал из getId космоса</p>
  </body>
  </html>`);
});

router.post('/users', (req, res) => {
  const {name, about, avatar} = req.body;
  //const name = "named";
  //const about = "about";
  userSchema.create({name: name, about: about, avatar: avatar})
    // вернём записанные в базу данные
    //.then(user => res.send({ data: user }))
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send(err));
});

module.exports = router;

/* добавить ответы

{
    "name": "Стас",
    "about": "Разработчик",
    "avatar": "https://arte1.ru/images/detailed/4/23608.jpg",
    "_id":"dd8b6dea22fe4ea0ad5d46f4",
}

*/