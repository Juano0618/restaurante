const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');

router.get('/', mesaController.obtenerMesas);
router.post('/', mesaController.crearMesa);
router.put('/:id', mesaController.actualizarMesa);
router.delete('/:id', mesaController.eliminarMesa);

module.exports = router;
