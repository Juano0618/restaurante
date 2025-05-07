const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  _id: Number,
  nombre: String,
  usuario: String,
  password: String,
  rol: String
});

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
