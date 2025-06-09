// Este componente muestra los filtros por categoría y ordenamiento (precio y rating)
function Filtros({ categorias, categoriaSeleccionada, setCategoriaSeleccionada, orden, setOrden }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Filtro por categoría */}
      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select
          className="p-2 border rounded"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Ordenamiento por precio y rating */}
      <div>
        <label className="block text-sm font-medium mb-1">Ordenar por</label>
        <select
          className="p-2 border rounded"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        >
          <option value="">Ninguno</option>
          <option value="precio-asc">Precio (menor a mayor)</option>
          <option value="precio-desc">Precio (mayor a menor)</option>
          <option value="rating-asc">Rating (menor a mayor)</option>
          <option value="rating-desc">Rating (mayor a menor)</option>
        </select>
      </div>
    </div>
  );
}

export default Filtros;
