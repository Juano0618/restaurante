const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  _id: Number, // <- tipo Number si estás usando IDs tipo 1, 2, 3
  nombre: String,
  usuario: String,
  password: String,
  rol: String
});

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
