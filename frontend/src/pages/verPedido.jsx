import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerPedido = () => {
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [estadoPago, setEstadoPago] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const pedidoGuardado = localStorage.getItem('pedidoActual');
    if (pedidoGuardado) {
      const datos = JSON.parse(pedidoGuardado);
      setPedido(datos);

      axios.get(`${process.env.REACT_APP_API}/api/productos`)
        .then(res => setProductos(res.data));
    }
  }, []);

  if (!pedido) return (
    <div
      className="min-h-screen flex items-center justify-center text-red-500 text-xl"
      style={{
        backgroundColor: '#000',
        backgroundImage: "url('/logo.avif')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '300px',
      }}
    >
      No hay pedido actual.
    </div>
  );

  const calcularTotal = () => {
    let total = 0;
    pedido.items.forEach(item => {
      const producto = productos.find(p => p._id === item.productoId);
      if (producto) {
        total += producto.precio * item.cantidad;
      }
    });
    return total;
  };

  const pagarPedido = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/pedidos/${pedido._id}`, {
        ...pedido,
        estado: 'pagado',
        pagado: true,
        metodoPago: 'tarjeta',
        total: calcularTotal()
      });

      await axios.put(`${process.env.REACT_APP_API}/api/mesas/${pedido.idMesa}`, {
        estado: 'disponible'
      });

      localStorage.removeItem('pedidoActual');
      localStorage.removeItem('mesaSeleccionada');

      setEstadoPago('pagado');
      alert('Redirigiendo al sitio de pago...');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error al pagar:', err);
      alert('No se pudo procesar el pago.');
    }
  };

  const pedirCuenta = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/pedidos/${pedido._id}`, {
        ...pedido,
        estado: 'esperando cuenta'
      });

      setEstadoPago('esperando cuenta');
      alert('El garzón se acercará con su cuenta.');
    } catch (err) {
      console.error('Error al pedir cuenta:', err);
      alert('No se pudo solicitar la cuenta.');
    }
  };

  return (
    <div
      className="min-h-screen text-white p-6"
      style={{
        backgroundColor: '#000',
        backgroundImage: "url('/logo.avif')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '300px',
      }}
    >
      <div className="max-w-2xl mx-auto bg-black bg-opacity-80 p-6 rounded shadow">
        <h2 className="text-3xl font-bold mb-4 text-center">Resumen del Pedido</h2>

        {(estadoPago || pedido.estado) === 'en_preparación' && (
          <div className="mb-4 p-3 rounded bg-blue-600 text-white text-center font-semibold animate-bounce shadow">
            🕒 Tu pedido está en preparación. Pronto será entregado.
          </div>
        )}

        <p className="mb-2">Mesa: <strong>{pedido.idMesa}</strong></p>
        <p className="mb-4">Estado actual: <strong>{estadoPago || pedido.estado}</strong></p>

        <ul className="space-y-2 mb-4">
          {pedido.items.map((item, idx) => {
            const producto = productos.find(p => p._id === item.productoId);
            return (
              <li key={idx} className="border-b border-white pb-2">
                {producto?.nombre || `Producto ID ${item.productoId}`} - {item.cantidad} x ${producto?.precio || '?'}
              </li>
            );
          })}
        </ul>

        <p className="text-xl font-bold text-right mb-6">Total: ${calcularTotal()}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={pedirCuenta}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded font-semibold"
          >
            Pedir cuenta
          </button>

          <button
            onClick={pagarPedido}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
          >
            Pagar con tarjeta
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerPedido;
