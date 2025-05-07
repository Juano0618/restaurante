import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MesaSelector = () => {
  const [mesas, setMesas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/mesas`)
      .then((response) => setMesas(response.data))
      .catch((error) => console.error('Error al obtener mesas:', error));
  }, []);

  const seleccionarMesa = (mesaId) => {
    localStorage.setItem('mesaSeleccionada', mesaId);
    navigate('/menu'); // redirige a la página del menú
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      {/* Logo */}
      <img src="/logo.avif" alt="Logo" className="h-32 mb-6" />

      {/* Título */}
      <h1 className="text-3xl font-bold mb-6">MESAS DISPONIBLES</h1>

      {/* Cuadrícula de mesas */}
      <div className="grid grid-cols-3 gap-6 max-w-xl w-full">
        {mesas.map((mesa) => (
          <button
            key={mesa._id}
            onClick={() => seleccionarMesa(mesa.numero)}
            className={`h-19 flex items-center justify-center rounded-md text-2xl font-bold border 
              ${mesa.estado === 'disponible'
                ? 'bg-white text-black hover:bg-gray-200 transition'
                : 'bg-gray-600 text-white cursor-not-allowed'}`}
            disabled={mesa.estado !== 'disponible'}
          >
            {mesa.numero}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MesaSelector;
