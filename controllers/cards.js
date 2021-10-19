const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const InternalServerError = require('../errors/internal-server-err');
const ForbiddenError = require('../errors/forbidden-err');

// получение всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Ошибка: Переданы некорректные данные при создании карточки - ${err}`);
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// удаление карточки
const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      if (card && card.owner.toString() === req.user._id) {
        Card.deleteOne({ _id: card._id })
          .then(res.send({ message: 'Карточка удалена' }));
      } else {
        throw new ForbiddenError('Запрещено удалять карточки чужих пользователей');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка: Передан невалидный id');
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// поставить лайк карточке
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.send({ message: 'Лайк' });
      }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка: Переданы некорректные данные для постановки лайка');
      } if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка: Передан невалидный id');
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

// убрать лайк карточки
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .then((card) => {
      if (card) {
        return res.send({ message: 'ДизЛайк' });
      }
      throw new NotFoundError('Карточка не найдена');
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка: Переданы некорректные данные для снятия лайка');
      } if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка: Передан невалидный id');
      }
      throw new InternalServerError(`Ошибка: ${err}`);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
