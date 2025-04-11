const Mesa = require('../models/Mesa');

// GET todas las mesas
exports.obtenerMesas = async (req, res) => {
  const mesas = await Mesa.find();
  res.json(mesas);
};

// POST nueva mesa
exports.crearMesa = async (req, res) => {
  const nuevaMesa = new Mesa(req.body);
  await nuevaMesa.save();
  res.status(201).json(nuevaMesa);
};

// PUT actualizar mesa
exports.actualizarMesa = async (req, res) => {
  const mesaActualizada = await Mesa.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(mesaActualizada);
};

// DELETE eliminar mesa
exports.eliminarMesa = async (req, res) => {
  await Mesa.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Mesa eliminada' });
};
