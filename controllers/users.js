const User = require('../models/user');

// получение всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Ошибка: ${err}` }));
};

// получение пользователя
const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Ошибка: Передан невалидный id' });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

// создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Ошибка: Переданы некорректные данные при создании пользователя - ${err}` });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

// обновление профиля
const patchUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Ошибка: Переданы некорректные данные при обновлении профиля - ${err}` });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

// обновление аватара
const patchAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Ошибка: Переданы некорректные данные при обновлении аватара - ${err}` });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchAvatar,
};
