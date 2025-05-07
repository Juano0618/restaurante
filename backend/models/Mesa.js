const mongoose = require('mongoose');

const MesaSchema = new mongoose.Schema({
  _id: Number,
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

module.exports = mongoose.models.Mesa || mongoose.model('Mesa', MesaSchema);
