const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const Pedido = require('../models/Pedido');

// 🔵 Obtener pedido activo por mesa
router.get('/mesa/:mesaId', async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      idMesa: parseInt(req.params.mesaId),
      estado: { $in: ['pendiente', 'en preparación'] }
    });

    if (!pedido) return res.status(404).json(null);
    res.json(pedido);
  } catch (err) {
    console.error('Error al obtener pedido por mesa:', err);
    res.status(500).json({ error: 'Error al buscar pedido de mesa' });
  }
});

// 🔵 Obtener pedidos activos para vista admin
router.get('/activos', async (req, res) => {
  try {
    const pedidos = await Pedido.find({
      estado: { $in: ['pendiente', 'en preparación', 'esperando cuenta'] },
      pagado: false
    }).populate('idMesa').populate('items.productoId');

    res.json(pedidos);
  } catch (err) {
    console.error('Error al obtener pedidos activos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔵 Obtener pedidos listos para servir
router.get('/listos-para-servir', async (req, res) => {
  try {
    const pedidos = await Pedido.find({
      estado: 'listo_para_servir',
      pagado: false
    }).populate('idMesa').populate('items.productoId');

    res.json(pedidos);
  } catch (err) {
    console.error('Error al obtener pedidos listos para servir:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔵 Obtener pedido por ID (después de las rutas específicas)
router.get('/:id', pedidoController.obtenerPedidoPorId);

// 🔵 Actualizar pedido
router.put('/:id', pedidoController.actualizarPedido);

// 🔵 Eliminar pedido
router.delete('/:id', pedidoController.eliminarPedido);

// 🔵 Marcar pedido como pagado
router.put('/:id/pagar', pedidoController.marcarComoPagado);

// 🔵 Obtener todos los pedidos
router.get('/', pedidoController.obtenerPedidos);

// 🔵 Crear un nuevo pedido con validación
router.post('/', async (req, res, next) => {
  try {
    console.log('Pedido recibido:', req.body);

    if (!req.body.idMesa || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos para crear pedido' });
    }

    await pedidoController.crearPedido(req, res);
  } catch (err) {
    console.error('Error inesperado al crear pedido:', err);
    res.status(500).json({ error: 'Error inesperado al crear pedido' });
  }
});

module.exports = router;
