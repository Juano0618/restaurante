import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MesaSelector from '../components/MesaSelector';
import Menu from '../pages/Menu';
import VerPedido from '../pages/verPedido';
import PagoExitoso from '../pages/pagoExitoso';
import VistaAdmin from '../pages/VistaAdmin';
import VistaCocina from '../pages/VistaCocina';
import VistaBar from '../pages/VistaBar';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mesas" element={<MesaSelector />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/ver-pedido" element={<VerPedido />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/cocina" element={<VistaCocina />} />
        <Route path="/admin" element={<VistaAdmin />} />
        <Route path="/bar" element={<VistaBar />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
