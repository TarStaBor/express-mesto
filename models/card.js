const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // имя карточки
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // ссылка на картинку
  link: {
    type: String,
    required: true,
  },
  // ссылка на модель автора карточки
  owner: {
    type: String,
    required: true,
  },
  // список лайкнувших пост пользователей
  likes: {
    type: Array,
    default: [],
  },
  // дата создания
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
