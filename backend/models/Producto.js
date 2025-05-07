const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  _id: Number,
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String }
});

module.exports = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);