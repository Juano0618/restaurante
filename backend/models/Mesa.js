const mongoose = require('mongoose');

const MesaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
    unique: true
  },
  estado: {
    type: String,
    enum: ['disponible', 'ocupada', 'reservada', 'esperando pedido'],
    default: 'disponible'
  }
});

module.exports = mongoose.model('Mesa', MesaSchema);
