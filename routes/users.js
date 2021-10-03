const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

// получение всех пользователей
router.get('/', getUsers);
// получение пользователя
router.get('/:id', getUser);
// создание пользователя
router.post('/', createUser);
// обновление профиля
router.patch('/:id', patchUser);
// обновление аватара
router.patch('/:id/avatar', patchAvatar);

module.exports = router;
