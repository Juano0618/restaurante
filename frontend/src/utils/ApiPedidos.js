import axios from 'axios';

export const actualizarEstadoPedido = async (id, estado) => {
  return axios.put(`${process.env.REACT_APP_API}/api/pedidos/${id}`, { estado });
};
