const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routers/user'); // импорт роутера пользователей
const cardsRouter = require('./routers/card'); // импорт роутера карточек

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62af276f9b57cc3c0ebd5e92', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// подключаем роуты
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
