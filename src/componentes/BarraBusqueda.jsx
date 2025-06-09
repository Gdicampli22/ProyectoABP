// BarraBusqueda.jsx
import React from "react";

const BarraBusqueda = ({
  filtro,
  setFiltro,
  manejarBusqueda,
  categoriaFiltro,
  setCategoriaFiltro,
  ordenamiento,
  setOrdenamiento,
}) => {
  // Categorías fijas según DummyJSON para select
  const categorias = [
    "",
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
  ];

  // Manejar cambio en select de ordenamiento
  const manejarCambioOrden = (e) => {
    const valor = e.target.value;
    if (valor === "") {
      setOrdenamiento({ campo: "", direccion: "" });
    } else {
      const [campo, direccion] = valor.split("-");
      setOrdenamiento({ campo, direccion });
    }
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border border-gray-400 rounded px-3 py-2 w-full sm:w-1/3"
      />
      <button
        onClick={manejarBusqueda}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buscar
      </button>

      {/* Select para filtro por categoría */}
      <select
        value={categoriaFiltro}
        onChange={(e) => setCategoriaFiltro(e.target.value)}
        className="border border-gray-400 rounded px-3 py-2 w-full sm:w-1/4"
      >
        <option value="">Todas las categorías</option>
        {categorias.slice(1).map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      {/* Select para ordenamiento */}
      <select
        value={ordenamiento.campo ? `${ordenamiento.campo}-${ordenamiento.direccion}` : ""}
        onChange={manejarCambioOrden}
        className="border border-gray-400 rounded px-3 py-2 w-full sm:w-1/4"
      >
        <option value="">Ordenar por...</option>
        <option value="price-asc">Precio: Menor a Mayor</option>
        <option value="price-desc">Precio: Mayor a Menor</option>
        <option value="rating-asc">Rating: Menor a Mayor</option>
        <option value="rating-desc">Rating: Mayor a Menor</option>
      </select>
    </div>
  );
};

export default BarraBusqueda;
