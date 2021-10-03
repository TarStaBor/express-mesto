const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // имя пользователя
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // информация о пользователе
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // ссылка на аватарку
  avatar: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
