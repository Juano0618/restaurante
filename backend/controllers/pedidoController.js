const Pedido = require('../models/Pedido');

// GET todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  const pedidos = await Pedido.find().populate('idMesa').populate('items.productoId').populate('idUsuario');
  res.json(pedidos);
};

// POST nuevo pedido
exports.crearPedido = async (req, res) => {
  const pedido = new Pedido(req.body);
  await pedido.save();
  res.status(201).json(pedido);
};

// PUT actualizar pedido
exports.actualizarPedido = async (req, res) => {
  const actualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
};

// DELETE eliminar pedido
exports.eliminarPedido = async (req, res) => {
  await Pedido.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Pedido eliminado' });
};
