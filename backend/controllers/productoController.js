const Producto = require('../models/Producto');

// GET todos los productos
exports.obtenerProductos = async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
};

// POST nuevo producto
exports.crearProducto = async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  res.status(201).json(nuevoProducto);
};

// PUT actualizar producto
exports.actualizarProducto = async (req, res) => {
  const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(productoActualizado);
};

// DELETE eliminar producto
exports.eliminarProducto = async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
};
