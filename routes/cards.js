const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

// получение всех карточек
router.get('/', getCards);
// создание карточки
router.post('/', createCard);
// удаление карточки
router.delete('/:id', deleteCard);
// поставить лайк карточке
router.put('/:cardId/like', putLike);
// убрать лайк карточки
router.delete('/:cardId/like', deleteLike);

module.exports = router;
