import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/mesas');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      <div className="mb-10">
        <img
          src="/logo.avif"
          alt="Logo Restaurante"
          className="h-44 w-auto mx-auto"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-serif tracking-wider mb-6">BIENVENIDOS</h1>
      <p className="text-lg md:text-xl mb-8">MESAS DISPONIBLES</p>

      <button
        onClick={handleNavigate}
        className="bg-white text-black px-6 py-3 rounded shadow hover:bg-gray-200 transition"
      >
        Elegir mesa
      </button>
    </div>
  );
};

export default Home;