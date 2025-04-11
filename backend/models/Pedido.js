const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productoId: { type: Number, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true }
}, { _id: false });

const PedidoSchema = new mongoose.Schema({
  idMesa: { type: Number, ref: 'Mesa', required: true },
  estado: {
    type: String,
    enum: ['esperando pedido', 'pendiente', 'en preparación', 'listo'],
    default: 'pendiente'
  },
  fechaHora: { type: Date, default: Date.now },
  items: [ItemSchema],
  total: { type: Number },
  notas: { type: String },
  idUsuario: { type: Number, ref: 'Usuario' }
});

console.log("✅ Modelo Pedido cargado con tipo Number");

module.exports = mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema);
