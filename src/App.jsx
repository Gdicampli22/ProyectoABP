import { useEffect, useState } from "react";
import axios from "axios";
import ListaProductos from "./componentes/ListaProductos";
import PanelEstadisticas from "./componentes/PanelEstadisticas";
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");         // Lo que el usuario escribe
  const [filtroActivo, setFiltroActivo] = useState(""); // Se aplica al hacer clic en "Buscar"
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=100")
      .then((respuesta) => {
        setProductos(respuesta.data.products);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  // Aplicar filtro solo cuando se actualiza filtroActivo
  const productosFiltrados = productos.filter(producto =>
    producto.title.toLowerCase().includes(filtroActivo.toLowerCase())
  );

  // Al hacer clic en el botón
  const manejarBusqueda = () => {
    setFiltroActivo(filtro);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">Listado de Productos</h1>

      <div className="flex flex-col md:flex-row gap-2 mb-6 w-full md:w-1/2">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Buscar producto por título..."
          // Solo se actualiza el input, sin activar búsqueda
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button
          onClick={manejarBusqueda}
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      {cargando ? (
        <p className="text-center">Cargando productos...</p>
      ) : (
        <>
          <PanelEstadisticas productos={productosFiltrados} />
          <ListaProductos productos={productosFiltrados} />
        </>
      )}
    </div>
  );
}

export default App;
