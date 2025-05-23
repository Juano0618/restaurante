import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { actualizarEstadoPedido } from '../utils/ApiPedidos'; // función centralizada


const VistaCocina = () => {
  const [pedidosActivos, setPedidosActivos] = useState([]);

  const cargarPedidos = () => {
    axios.get(`${process.env.REACT_APP_API}/api/pedidos/activos`)
      .then(res => {
        const categoriasComida = ['para empezar', 'para compartir', 'sándwich', 'pizza'];

        const pedidosCocina = res.data
          .filter(p => p.estado !== 'esperando cuenta') // ocultar pedidos que piden la cuenta
          .map(pedido => ({
            ...pedido,
            items: pedido.items.filter(item =>
              categoriasComida.includes(item.productoId?.categoria?.toLowerCase())
            )
          }))
          .filter(pedido => pedido.items.length > 0);

        setPedidosActivos(pedidosCocina);
      })
      .catch(err => console.error("Error al cargar pedidos activos para la cocina:", err));
  };

  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 2000);
    return () => clearInterval(intervalo);
  }, []);

  const calcularTiempo = (fecha) => {
    const inicio = new Date(fecha);
    const ahora = new Date();
    const minutos = Math.floor((ahora - inicio) / 60000);
    if (minutos < 1) return 'Hace menos de 1 min';
    return `Hace ${minutos} min`;
  };

  const manejarCambioEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      cargarPedidos();
    } catch (err) {
      console.error('Error al actualizar estado del pedido:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6"
      style={{
        backgroundColor: '#000',
        backgroundImage: "url('/logo.avif')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Vista Cocina</h1>

      {pedidosActivos.length === 0 ? (
        <p className="text-center text-gray-400">No hay pedidos pendientes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidosActivos.map((pedido) => (
            <div
              key={pedido._id}
              className="border border-white bg-white bg-opacity-10 rounded-lg p-4 shadow-md"
            >
              <h2 className="text-xl font-bold mb-2">Mesa {pedido.idMesa?.numero || pedido.idMesa}</h2>
              <p>Estado: <span className="font-semibold capitalize">{pedido.estado.replace('_', ' ')}</span></p>
              <p>Tiempo: {calcularTiempo(pedido.fechaHora)}</p>

              <div className="mt-2">
                <p className="font-semibold underline">Productos:</p>
                <ul className="text-sm list-disc list-inside">
                  {pedido.items.map((item, idx) => (
                    <li key={idx}>
                      {item.productoId?.nombre || 'Producto'} x{item.cantidad}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {pedido.estado === 'pendiente' && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                    onClick={() => manejarCambioEstado(pedido._id, 'en preparación')}
                  >
                    En preparación
                  </button>
                )}
                {(pedido.estado === 'pendiente' || pedido.estado === 'en preparación') && (
                  <button
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
                    onClick={() => manejarCambioEstado(pedido._id, 'listo_para_servir')}
                  >
                    Listo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VistaCocina;

