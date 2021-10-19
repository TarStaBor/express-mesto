const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const InternalServerError = require('../errors/internal-server-err');

// получение всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// получение пользователя
const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка: Передан невалидный id');
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// информация о текущем пользователе
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// создание пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Ошибка: Переданы некорректные данные при создании пользователя - ${err}`);
      }
      if (err.name === 'MongoServerError') {
        throw new ConflictError('Ошибка: Пользователь с такой почтой уже зарегистрирован');
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// вход
const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Ошибка: Переданы некорректные данные авторизации - ${err}`);
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// обновление профиля
const patchUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Ошибка: Переданы некорректные данные при обновлении профиля - ${err}`);
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// обновление аватара
const patchAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Ошибка: Переданы некорректные данные при обновлении аватара - ${err}`);
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  createUser,
  login,
  patchUser,
  patchAvatar,
};
