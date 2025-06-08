import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ListaProductos from "./componentes/ListaProductos";
import PanelEstadisticas from "./componentes/PanelEstadisticas";
import BarraBusqueda from "./componentes/BarraBusqueda";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import './App.css';

const API_KEY_PIXABAY = "50735154-38fd944d012e5ed32d9c1f9b7";

function App() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const seccionPrincipal = useRef(null);

  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=20")
      .then(async (respuesta) => {
        const productosOriginales = respuesta.data.products;

        const productosConImagen = await Promise.all(
          productosOriginales.map(async (producto) => {
            try {
              const respuestaImagen = await axios.get("https://pixabay.com/api/", {
                params: {
                  key: API_KEY_PIXABAY,
                  q: producto.title,
                  image_type: "photo",
                  per_page: 3,
                },
              });
              const imagenURL = respuestaImagen.data.hits[0]?.webformatURL || "";
              return { ...producto, imagenURL };
            } catch (error) {
              console.error("Error buscando imagen:", error);
              return { ...producto, imagenURL: "" };
            }
          })
        );

        setProductos(productosConImagen);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  const manejarBusqueda = () => {
    setFiltroActivo(filtro);
    if (seccionPrincipal.current) {
      seccionPrincipal.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleEstadisticas = () => {
    setMostrarEstadisticas(prev => !prev);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setFiltro("");
    setFiltroActivo("");
  };

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const datosUsuario = jwtDecode(token);
    setUsuario(datosUsuario);
  };

  const handleLoginError = () => {
    console.log("Login fallido");
  };

  const productosFiltrados = productos.filter(producto =>
    producto.title.toLowerCase().includes(filtroActivo.toLowerCase())
  );

  return (
    <GoogleOAuthProvider clientId="891241510947-9c8tfjj23o8r1kska4u1r8rg3f79oiqm.apps.googleusercontent.com">
      <div className="p-6 max-w-6xl mx-auto transition-colors duration-300 bg-white dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800 dark:text-blue-300">
          Listado de Productos
        </h1>

        {!usuario ? (
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </div>
        ) : (
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold">Bienvenido, {usuario.name}</h2>
            <img
              src={usuario.picture}
              alt="Foto de perfil"
              className="mx-auto rounded-full w-20 h-20"
            />
            <p>{usuario.email}</p>
            <button
              onClick={cerrarSesion}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        )}

        {usuario && (
          <>
            <BarraBusqueda
              filtro={filtro}
              setFiltro={setFiltro}
              manejarBusqueda={manejarBusqueda}
            />

            <button
              onClick={toggleEstadisticas}
              className="mb-4 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded"
            >
              {mostrarEstadisticas ? "Ocultar estadísticas" : "Mostrar estadísticas"}
            </button>

            <div ref={seccionPrincipal}>
              {cargando ? (
                <p className="text-center">Cargando productos...</p>
              ) : (
                <>
                  {mostrarEstadisticas && (
                    <PanelEstadisticas productos={productosFiltrados} />
                  )}
                  <ListaProductos productos={productosFiltrados} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
