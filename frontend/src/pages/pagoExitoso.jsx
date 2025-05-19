import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const pedidoGuardado = localStorage.getItem('pedidoActual');

    if (pedidoGuardado) {
      const pedido = JSON.parse(pedidoGuardado);
      const idMesa = pedido.idMesa;

      // Liberar la mesa en MongoDB
      axios.put(`${process.env.REACT_APP_API}/api/mesas/${idMesa}`, {
        estado: 'disponible'
      })
      .then(() => {
        // Limpiar datos locales
        localStorage.removeItem('pedidoActual');
        localStorage.removeItem('mesaSeleccionada');

        // Redirigir al home tras 9 segundos
        setTimeout(() => {
          navigate('/');
        }, 9000);
      })
      .catch(err => {
        console.error('Error al liberar mesa:', err);
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-center text-black flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">✅ ¡Gracias por tu pago!</h1>
      <p className="text-lg">Tu pedido ha sido pagado correctamente.</p>
      <p className="text-sm mt-2">Serás redirigido al inicio en unos segundos...</p>
    </div>
  );
};

export default PagoExitoso;
