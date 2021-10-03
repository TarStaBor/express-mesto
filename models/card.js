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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // список лайкнувших пост пользователей
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  // дата создания
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
