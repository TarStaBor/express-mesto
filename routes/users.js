const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserMe,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

// получение всех пользователей
router.get('/', getUsers);

// информация о текущем пользователе
router.get('/me', getUserMe);

// получение пользователя
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

// обновление профиля
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

// обновление аватара
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(3),
  }),
}), patchAvatar);

module.exports = router;
