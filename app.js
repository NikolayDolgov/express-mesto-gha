// app.js — входной файл

const express = require('express');
//const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser');
////////////////////////////////////////////////////////////////////////////////
const usersRouter = require('./routers/user'); // импорт роутера пользователей
const cardsRouter = require('./routers/card'); // импорт роутера карточек
////////////////////////////////////////////////////////////////////////////////
// подключаемся к серверу mongo
//mongoose.connect('mongodb://localhost:27017/mestodb');

/*const logger = (req, res, next) => {
  console.log('Запрос залогирован!');
  next();
};*/
//app.use(middleware);
//app.use(logger);
//////////////////////////
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62ae076389720ea4de30f53c' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

app.use('/', usersRouter);

app.use('/', cardsRouter);
//////////////////////////
app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})
