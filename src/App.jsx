import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ListaProductos from "./componentes/ListaProductos";
import PanelEstadisticas from "./componentes/PanelEstadisticas";
import BarraBusqueda from "./componentes/BarraBusqueda";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; 
import { jwtDecode } from "jwt-decode";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import './App.css';

// Utilidades para exportar CSV
const exportarCSV = (productos) => {
  const encabezados = Object.keys(productos[0] || {});
  const filas = productos.map(prod => encabezados.map(h => prod[h]));
  const csv = [
    encabezados.join(","),
    ...filas.map(fila => fila.map(celda => `"${celda}"`).join(","))
  ].join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
};

function App() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [ordenamiento, setOrdenamiento] = useState({ campo: "", direccion: "" });
  const [cargando, setCargando] = useState(true);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState(null); // Para mensajes de éxito/error
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  const seccionPrincipal = useRef(null);
  const modoOscuroRef = useRef(null);

  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=100")
      .then(async (respuesta) => {
        const productosOriginales = respuesta.data.products;
        const productosConImagen = await Promise.all(
          productosOriginales.map(async (producto) => {
            try {
              const respuestaImagen = await axios.get("https://pixabay.com/api/", {
                params: {
                  key: "50735154-38fd944d012e5ed32d9c1f9b7",
                  q: producto.title,
                  image_type: "photo",
                  per_page: 3,
                },
              });
              const imagenURL = respuestaImagen.data.hits[0]?.webformatURL || "";
              return { ...producto, imagenURL };
            } catch (error) {
              return { ...producto, imagenURL: "" };
            }
          })
        );
        setProductos(productosConImagen);
        setCargando(false);
      })
      .catch(() => {
        setCargando(false);
        setMensaje({ tipo: "error", texto: "Error al cargar productos." });
      });
  }, []);

  // Filtrado y ordenamiento
  let productosFiltrados = productos.filter(producto =>
    producto.title.toLowerCase().includes(filtro.toLowerCase()) &&
    (categoriaFiltro === "" || producto.category === categoriaFiltro)
  );

  if (ordenamiento.campo) {
    productosFiltrados.sort((a, b) => {
      const valA = a[ordenamiento.campo];
      const valB = b[ordenamiento.campo];
      if (ordenamiento.direccion === "asc") return valA - valB;
      else return valB - valA;
    });
  }

  // Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimero, indiceUltimo);

  // Exportar funciones
  const exportarJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(productosFiltrados, null, 2)], { type: "application/json" });
      saveAs(blob, "productos.json");
      setMensaje({ tipo: "exito", texto: "Exportación a JSON exitosa." });
    } catch {
      setMensaje({ tipo: "error", texto: "Error en exportación JSON." });
    }
  };

  const exportarCSVClick = () => {
    try {
      if (productosFiltrados.length === 0) {
        setMensaje({ tipo: "error", texto: "No hay productos para exportar." });
        return;
      }
      const blob = exportarCSV(productosFiltrados);
      saveAs(blob, "productos.csv");
      setMensaje({ tipo: "exito", texto: "Exportación a CSV exitosa." });
    } catch {
      setMensaje({ tipo: "error", texto: "Error en exportación CSV." });
    }
  };

  const exportarExcel = () => {
    try {
      const hoja = XLSX.utils.json_to_sheet(productosFiltrados);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, "Productos");
      const archivoExcel = XLSX.write(libro, { bookType: "xlsx", type: "array" });
      const blob = new Blob([archivoExcel], { type: "application/octet-stream" });
      saveAs(blob, "productos.xlsx");
      setMensaje({ tipo: "exito", texto: "Exportación a Excel exitosa." });
    } catch {
      setMensaje({ tipo: "error", texto: "Error en exportación Excel." });
    }
  };

  const manejarBusqueda = () => {
    if (seccionPrincipal.current) {
      seccionPrincipal.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleEstadisticas = () => setMostrarEstadisticas(prev => !prev);

  const cerrarSesion = () => {
    setUsuario(null);
    setFiltro("");
    setCategoriaFiltro("");
    setOrdenamiento({ campo: "", direccion: "" });
  };

  const handleLoginSuccess = (credentialResponse) => {
    const datosUsuario = jwtDecode(credentialResponse.credential);
    setUsuario(datosUsuario);
  };

  const handleLoginError = () => {
    setMensaje({ tipo: "error", texto: "Login fallido. Intenta nuevamente." });
  };

  // Visualizaciones como en semana 5 (cantidad por categoría, evolución precios, stock)

  // Cantidad por categoría (BarChart)
  const dataCategorias = Object.entries(
    productosFiltrados.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  // Evolución de precios simulada (LineChart)
  const preciosPorMes = Array.from({ length: 12 }, (_, i) => {
    const preciosMes = productosFiltrados
      .filter((_, idx) => idx % 12 === i)
      .map(p => p.price);
    const promedio = preciosMes.length ? preciosMes.reduce((a, b) => a + b, 0) / preciosMes.length : 0;
    return { mes: `Mes ${i + 1}`, precio: Number(promedio.toFixed(2)) };
  });

  // Proporción por stock (PieChart)
  const stockCategorias = productosFiltrados.reduce((acc, p) => {
    if (p.stock < 20) acc.Bajo = (acc.Bajo || 0) + 1;
    else if (p.stock < 50) acc.Medio = (acc.Medio || 0) + 1;
    else acc.Alto = (acc.Alto || 0) + 1;
    return acc;
  }, {});

  const dataStock = Object.entries(stockCategorias).map(([name, value]) => ({ name, value }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const toggleModoOscuro = () => {
    modoOscuroRef.current.classList.toggle('dark');
  };

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);S
    manejarBusqueda();
  };

  return (
    <GoogleOAuthProvider clientId="891241510947-9c8tfjj23o8r1kska4u1r8rg3f79oiqm.apps.googleusercontent.com">
      <div ref={modoOscuroRef} className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-6" aline>

          <header className="relative flex items-center mb-6">
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-blue-800 dark:text-blue-300">
              Listado de Productos
            </h1>
             <button
                onClick={toggleModoOscuro}
                className="ml-auto px-4 py-2 rounded bg-black dark:bg-white text-white dark:text-black"
              >
              Modo Oscuro
              </button>
          </header>

          {!usuario ? (
            <div className="flex justify-center my-4">
              <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold">Bienvenido, {usuario.name}</h2>
                <img src={usuario.picture} alt="Foto de perfil" className="mx-auto rounded-full w-20 h-20" />
                <p>{usuario.email}</p>
                <button
                  onClick={cerrarSesion}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-black font-bold py-2 px-4 rounded"
                >
                  Cerrar sesión
                </button>
              </div>

              <BarraBusqueda
                filtro={filtro}
                setFiltro={setFiltro}
                manejarBusqueda={manejarBusqueda}
                categoriaFiltro={categoriaFiltro}
                setCategoriaFiltro={setCategoriaFiltro}
                ordenamiento={ordenamiento}
                setOrdenamiento={setOrdenamiento}
              />

              <div className="mb-4 flex flex-wrap gap-4">
                <button
                  onClick={exportarJSON}
                  className="bg-blue-600 hover:bg-blue-700 text-black font-semibold py-2 px-4 rounded"
                >
                  Exportar JSON
                </button>
                <button
                  onClick={exportarCSVClick}
                  className="bg-green-600 hover:bg-green-700 text-black font-semibold py-2 px-4 rounded"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={exportarExcel}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded"
                >
                  Exportar Excel
                </button>
                <button
                  onClick={() => setMostrarEstadisticas(prev => !prev)}
                  className="bg-gray-600 hover:bg-gray-700 text-black font-semibold py-2 px-4 rounded"
                >
                  {mostrarEstadisticas ? "Ocultar estadísticas" : "Mostrar estadísticas"}
                </button>
              </div>

              {mensaje && (
                <div className={`mb-4 p-4 rounded ${mensaje.tipo === "exito" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                  {mensaje.texto}
                </div>
              )}

              <main ref={seccionPrincipal}>
                {cargando ? (
                  <p className="text-center">Cargando productos...</p>
                ) : (
                  <>
                    {mostrarEstadisticas && (
                      <>
                        <PanelEstadisticas productos={productosFiltrados} />

                        <section className="mt-10">
                          <h3 className="text-2xl font-semibold mb-6">Visualizaciones</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* BarChart - Cantidad por categoría */}
                            <div>
                              <h4 className="text-xl font-semibold mb-2">Productos por Categoría</h4>
                              <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={dataCategorias} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <XAxis dataKey="category" />
                                  <YAxis allowDecimals={false} />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>

                            {/* LineChart - Evolución de precios */}
                            <div>
                              <h4 className="text-xl font-semibold mb-2">Evolución de Precios (Simulada)</h4>
                              <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={preciosPorMes} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                  <XAxis dataKey="mes" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Line type="monotone" dataKey="precio" stroke="#82ca9d" />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* PieChart - Proporción por stock */}
                            <div>
                              <h4 className="text-xl font-semibold mb-2">Proporción de Productos por Stock</h4>
                              <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                  <Pie
                                    data={dataStock}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                  >
                                    {dataStock.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>

                          </div>
                        </section>
                      </>
                    )}

                    <ListaProductos productos={productosPaginados} />

                    {/* Controles paginación */}
                    <div className="mt-6 flex justify-center gap-4">
                      <button
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        className={`px-4 py-2 rounded ${paginaActual === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-black"}`}
                      >
                        Anterior
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        Página {paginaActual} de {totalPaginas}
                      </span>
                      <button
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                        className={`px-4 py-2 rounded ${paginaActual === totalPaginas ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-black"}`}
                      >
                        Siguiente
                      </button>
                    </div>
                  </>
                )}
              </main>
            </>
          )}

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
