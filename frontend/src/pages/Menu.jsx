import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [pedidoId, setPedidoId] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const mesaId = localStorage.getItem('mesaSeleccionada');

    if (mesaId) {
      axios.get(`${process.env.REACT_APP_API}/api/pedidos/mesa/${mesaId}`)
        .then(res => {
          if (res.data && res.data.estado !== 'pagado') {
            setPedidoId(res.data._id);
            setPedido(res.data.items);
            localStorage.setItem('pedidoActual', JSON.stringify(res.data));
          }
        })
        .catch(() => setPedido([]));

      axios.get(`${process.env.REACT_APP_API}/api/productos`)
        .then(res => setProductos(res.data));
    }
  }, []);

  const agregarAlPedido = (producto) => {
    const yaExiste = pedido.find(item => {
      const id = typeof item.productoId === 'object' ? item.productoId._id : item.productoId;
      return id === producto._id;
    });

    if (yaExiste) {
      setPedido(pedido.map(item => {
        const id = typeof item.productoId === 'object' ? item.productoId._id : item.productoId;
        return id === producto._id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item;
      }));
    } else {
      setPedido([...pedido, { productoId: producto._id, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (productoId, cambio) => {
    const actualizado = pedido.map(item => {
      const id = item.productoId._id || item.productoId;
      if (id === productoId) {
        const nuevaCantidad = item.cantidad + cambio;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
      }
      return item;
    }).filter(item => item.cantidad > 0);
    setPedido(actualizado);
  };

  const eliminarProducto = (productoId) => {
    const actualizado = pedido.filter(item => {
      const id = item.productoId._id || item.productoId;
      return id !== productoId;
    });
    setPedido(actualizado);
  };

  const realizarPedido = async () => {
    const mesaId = localStorage.getItem('mesaSeleccionada');
    if (!mesaId) {
      alert('No se ha seleccionado una mesa.');
      return;
    }

    // Convertir productoId a tipo primitivo (número o string)
    const itemsFormateados = pedido.map(item => ({
      productoId: typeof item.productoId === 'object' ? item.productoId._id : item.productoId,
      cantidad: item.cantidad
    }));

    try {
      let response;

      if (pedidoId) {
        response = await axios.put(`${process.env.REACT_APP_API}/api/pedidos/${pedidoId}`, {
          items: itemsFormateados
        });
      } else {
        response = await axios.post(`${process.env.REACT_APP_API}/api/pedidos`, {
          idMesa: parseInt(mesaId),
          items: itemsFormateados,
          idUsuario: 1,
          notas: '',
          estado: 'pendiente'
        });
      }

      localStorage.setItem('pedidoActual', JSON.stringify(response.data));

      setMensajeExito('¡Pedido realizado!');
      setTimeout(() => {
        setMensajeExito('');
        navigate('/ver-pedido');
      }, 2000);

    } catch (err) {
      console.error('Error al realizar pedido:', err);
      alert('Ocurrió un error al enviar o actualizar el pedido.');
    }
  };

  const calcularTotal = () => {
    return pedido.reduce((acc, item) => {
      const precio = item.productoId.precio || productos.find(p => p._id === item.productoId)?.precio || 0;
      return acc + (precio * item.cantidad);
    }, 0);
  };

  const productosPorCategoria = productos.reduce((acc, producto) => {
    const categoria = producto.categoria || 'Otros';
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

  const categorias = Object.keys(productosPorCategoria);

  return (
    <div
      className="flex min-h-screen text-white relative"
      style={{
        backgroundColor: '#000',
        backgroundImage: "url('/logo.avif')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}
    >
      {mensajeExito && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-bounce z-50">
          {mensajeExito}
        </div>
      )}

      <div className="w-3/4 p-6 bg-black bg-opacity-80">
        <h1 className="text-3xl font-bold mb-6 text-center">Menú del Restaurante</h1>

        <div className="sticky top-0 z-50 bg-black bg-opacity-90 shadow-md p-4 flex gap-4 overflow-x-auto mb-6">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`font-semibold whitespace-nowrap px-4 py-1 rounded 
                ${categoriaActiva === categoria ? 'bg-white text-black' : 'text-white hover:text-yellow-400'}`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {categoriaActiva && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productosPorCategoria[categoriaActiva].map(producto => (
                <div key={producto._id} className="border border-white p-4 rounded shadow bg-black bg-opacity-70">
                  <h4 className="font-semibold text-white">{producto.nombre}</h4>
                  <p className="text-sm text-gray-300">{producto.descripcion}</p>
                  <p className="mt-1 font-bold text-white">${producto.precio}</p>
                  <button
                    className="mt-2 bg-white text-black px-4 py-1 rounded hover:bg-gray-300"
                    onClick={() => agregarAlPedido(producto)}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-1/4 p-4 sticky top-0 h-screen overflow-y-auto bg-black bg-opacity-90 border-l border-white">
        <h3 className="text-xl font-bold mb-4 text-white">Pedido Actual</h3>
        {pedido.length === 0 ? (
          <p className="text-gray-400">No has agregado productos aún.</p>
        ) : (
          <ul className="space-y-2">
            {pedido.map((item, index) => {
              const producto = typeof item.productoId === 'object' ? item.productoId : productos.find(p => p._id === item.productoId);
              return (
                <li key={index} className="flex justify-between items-center border-b border-white pb-2">
                  <div>
                    <p className="font-semibold text-white">{producto?.nombre}</p>
                    <p className="text-sm text-gray-300">x{item.cantidad} - ${producto?.precio * item.cantidad}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 bg-green-500 text-white rounded"
                      onClick={() => cambiarCantidad(producto._id, 1)}
                    >+</button>
                    <button
                      className="px-2 bg-yellow-500 text-white rounded"
                      onClick={() => cambiarCantidad(producto._id, -1)}
                    >-</button>
                    <button
                      className="px-2 bg-red-500 text-white rounded"
                      onClick={() => eliminarProducto(producto._id)}
                    >X</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <hr className="my-3 border-white" />
        <p className="text-right font-semibold text-white">Total: ${calcularTotal()}</p>
        <button
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={realizarPedido}
          disabled={pedido.length === 0}
        >
          Realizar pedido
        </button>
      </div>
    </div>
  );
};

export default Menu;
