import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VistaGarzon = () => {
  const [pedidosListos, setPedidosListos] = useState([]);

  const cargarPedidos = () => {
    axios.get(`${process.env.REACT_APP_API}/api/pedidos/listos-para-servir`)
      .then(res => setPedidosListos(res.data))
      .catch(err => console.error("Error al cargar pedidos listos:", err));
  };

  const marcarEntregado = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/pedidos/${id}`, { estado: 'entregado' });
      cargarPedidos();
    } catch (err) {
      console.error('Error al marcar como entregado:', err);
    }
  };

  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6"
      style={{
        backgroundImage: "url('/logo.avif')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain'
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Pedidos Listos</h1>

      {pedidosListos.length === 0 ? (
        <p className="text-center text-gray-400">No hay pedidos listos actualmente.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidosListos.map((pedido) => (
            <div key={pedido._id} className="border rounded-lg p-4 shadow-md bg-white bg-opacity-10 border-green-400">
              <h2 className="text-xl font-bold mb-2">Mesa {pedido.idMesa?.numero || pedido.idMesa}</h2>
              <ul className="text-sm list-disc list-inside mb-4">
                {pedido.items.map((item, idx) => (
                  <li key={idx}>{item.productoId?.nombre || 'Producto'} x{item.cantidad}</li>
                ))}
              </ul>
              <button
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
                onClick={() => marcarEntregado(pedido._id)}
              >
                Entregar pedido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VistaGarzon;
