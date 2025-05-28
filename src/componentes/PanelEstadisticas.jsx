function PanelEstadisticas({ productos }) {
  if (!productos.length) return <p>No hay productos para mostrar estadísticas.</p>;

  const productoMasCaro = productos.reduce((prev, actual) => (actual.price > prev.price ? actual : prev));
  const productoMasBarato = productos.reduce((prev, actual) => (actual.price < prev.price ? actual : prev));
  const titulosLargos = productos.filter(p => p.title.length > 20).length;
  const precioTotal = productos.reduce((suma, p) => suma + p.price, 0);
  const promedioDescuento = (productos.reduce((suma, p) => suma + p.discountPercentage, 0) / productos.length).toFixed(2);

  return (
    <div className="bg-gray-100 p-4 rounded mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Estadísticas</h2>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>Producto más caro:</strong> {productoMasCaro.title} (${productoMasCaro.price})</li>
        <li><strong>Producto más barato:</strong> {productoMasBarato.title} (${productoMasBarato.price})</li>
        <li><strong>Títulos con más de 20 caracteres:</strong> {titulosLargos}</li>
        <li><strong>Precio total de productos:</strong> ${precioTotal}</li>
        <li><strong>Promedio de descuento:</strong> {promedioDescuento}%</li>
      </ul>
    </div>
  );
}

export default PanelEstadisticas;
