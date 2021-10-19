const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(6).email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// авторизация
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(6).email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

// обработчик ошибок celebrate
app.use(errors());

// обработчик ошибок
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
