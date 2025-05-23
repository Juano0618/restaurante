const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const Mesa = require('../models/Mesa');

// GET todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate({ path: 'items.productoId', model: 'Producto' })
      .populate({ path: 'idMesa', model: 'Mesa' })
      .populate({ path: 'idUsuario', model: 'Usuario' });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
  }
};

// GET pedidos activos para vista admin
exports.obtenerPedidosActivos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({
      estado: { $in: ['pendiente', 'en preparación', 'esperando cuenta'] },
      pagado: false
    }).populate({ path: 'idMesa', model: 'Mesa' });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos activos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST nuevo pedido
exports.crearPedido = async (req, res) => {
  try {
    const pedidoData = req.body;
    let total = 0;

    for (const item of pedidoData.items) {
      const productoId = parseInt(item.productoId);
      const producto = await Producto.findById(productoId);
      if (!producto) {
        return res.status(400).json({ error: `Producto con ID ${productoId} no encontrado` });
      }
      total += producto.precio * item.cantidad;
      item.productoId = producto._id;
    }

    pedidoData.total = total;

    const pedido = new Pedido(pedidoData);
    await pedido.save();

    await Mesa.findOneAndUpdate(
      { numero: pedido.idMesa },
      { estado: 'ocupada' }
    );

    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ error: 'No se pudo crear el pedido' });
  }
};

// PUT actualizar pedido
exports.actualizarPedido = async (req, res) => {
  try {
    const { estado, metodoPago, pagado } = req.body;

    const actualizaciones = {};

    if (estado) actualizaciones.estado = estado;
    if (typeof pagado === 'boolean') actualizaciones.pagado = pagado;
    if (metodoPago) actualizaciones.metodoPago = metodoPago;

    const actualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { $set: actualizaciones },
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ error: 'No se pudo actualizar el pedido' });
  }
};

// DELETE eliminar pedido
exports.eliminarPedido = async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ error: 'No se pudo eliminar el pedido' });
  }
};

// PUT marcar como pagado
exports.marcarComoPagado = async (req, res) => {
  try {
    const { metodoPago } = req.body;
    if (!['efectivo', 'tarjeta'].includes(metodoPago)) {
      return res.status(400).json({ error: 'Método de pago no válido' });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      {
        pagado: true,
        estado: 'pagado',
        metodoPago: metodoPago
      },
      { new: true }
    );

    if (pedido && pedido.idMesa) {
      await Mesa.findOneAndUpdate(
        { _id: pedido.idMesa },
        { estado: 'disponible' }
      );
    }

    res.json({ mensaje: 'Pedido pagado correctamente', pedido });
  } catch (error) {
    console.error('Error al pagar pedido:', error);
    res.status(500).json({ error: 'No se pudo actualizar el estado de pago' });
  }
};

// GET pedido por ID
exports.obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate({ path: 'items.productoId', model: 'Producto' })
      .populate({ path: 'idMesa', model: 'Mesa' });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido por ID:', error);
    res.status(500).json({ error: 'Error al obtener pedido por ID' });
  }
};
