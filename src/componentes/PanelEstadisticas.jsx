// 📁 src/componentes/PanelEstadisticas.jsx
function PanelEstadisticas({ productos }) {
  const total = productos.length;
  const promedioPrecio = (productos.reduce((acc, p) => acc + p.price, 0) / total).toFixed(2);
  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="mb-6 p-4 border rounded-xl shadow-md bg-gray-100 dark:bg-gray-700 dark:text-white">
      <h2 className="text-2xl font-semibold mb-2">Estadísticas</h2>
      <p>Total de productos: {total}</p>
      <p>Precio promedio: ${promedioPrecio}</p>
      <p>Stock total: {stockTotal}</p>
    </div>
  );
}

export default PanelEstadisticas;
