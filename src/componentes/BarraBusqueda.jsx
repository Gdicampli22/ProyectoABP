// 📁 src/componentes/BarraBusqueda.jsx
function BarraBusqueda({ filtro, setFiltro, manejarBusqueda }) {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-6 w-full md:w-1/2">
      <input
        type="text"
        className="border p-2 w-full dark:bg-gray-800 dark:text-white"
        placeholder="Buscar producto por título..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <button
        onClick={manejarBusqueda}
        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
      >
        Buscar
      </button>
    </div>
  );
}

export default BarraBusqueda;