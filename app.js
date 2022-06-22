const express = require('express');
const usersRouter = require('./routers/user'); // импорт роутера пользователей
const cardsRouter = require('./routers/card'); // импорт роутера карточек

const app = express();
const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mestodb');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    userId: '62af276f9b57cc3c0ebd5e92' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};
//-----//

// подключаем роуты
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  res.status(404).send({message: "Страница не найдена"})
})

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})