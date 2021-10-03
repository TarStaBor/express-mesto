const Card = require('../models/card');

// получение всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Ошибка: ${err}` }));
};

// создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Ошибка: Переданы некорректные данные при создании карточки - ${err}` });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

// удаление карточки
const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (card) {
        return res.send({ message: 'Карточка удалена' });
      }
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => res.status(500).send({ message: `Ошибка: ${err}` }));
};

// поставить лайк карточке
const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.send({ message: 'Лайк' });
      }
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка: Переданы некорректные данные для постановки лайка' });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

// убрать лайк карточки
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.send({ message: 'ДизЛайк' });
      }
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка: Переданы некорректные данные для снятии лайка' });
      }
      return res.status(500).send({ message: `Ошибка: ${err}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
