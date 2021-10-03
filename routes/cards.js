const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

// получение всех карточек
router.get('/', getCards);
// создание карточки
router.post('/', createCard);
// удаление карточки
router.delete('/:id', deleteCard);
// поставить лайк карточке
router.put('/:cardId/likes', putLike);
// убрать лайк карточки
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
