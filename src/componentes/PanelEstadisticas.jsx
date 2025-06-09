// PanelEstadisticas.jsx
import React from "react";

const PanelEstadisticas = ({ productos }) => {
  // Precio promedio de todos los productos
  const precioPromedio = productos.length > 0
    ? productos.reduce((acc, prod) => acc + prod.price, 0) / productos.length
    : 0;

  // Precio máximo y mínimo entre todos los productos
  const precios = productos.map(prod => prod.price);
  const precioMaximo = precios.length > 0 ? Math.max(...precios) : 0;
  const precioMinimo = precios.length > 0 ? Math.min(...precios) : 0;

  // Contar cantidad de productos por categoría (objeto con clave = categoría, valor = cantidad)
  const conteoPorCategoria = productos.reduce((acc, prod) => {
    acc[prod.category] = (acc[prod.category] || 0) + 1;
    return acc;
  }, {});

  // Cantidad de productos con stock > 50
  const productosConStockAlto = productos.filter(prod => prod.stock > 50).length;

  // Cantidad de productos con rating > 4.5
  const productosConBuenRating = productos.filter(prod => prod.rating > 4.5).length;

  // Precio promedio por categoría: suma y conteo por separado
  const sumaPreciosPorCategoria = {};
  const conteoProductosPorCategoria = {};
  productos.forEach(prod => {
    sumaPreciosPorCategoria[prod.category] = (sumaPreciosPorCategoria[prod.category] || 0) + prod.price;
    conteoProductosPorCategoria[prod.category] = (conteoProductosPorCategoria[prod.category] || 0) + 1;
  });
  // Calcular promedio precio por categoría
  const precioPromedioPorCategoria = {};
  for (const cat in sumaPreciosPorCategoria) {
    precioPromedioPorCategoria[cat] = sumaPreciosPorCategoria[cat] / conteoProductosPorCategoria[cat];
  }

  // Producto más caro y más barato por categoría
  const productosPorCategoria = {};
  productos.forEach(prod => {
    if (!productosPorCategoria[prod.category]) {
      productosPorCategoria[prod.category] = {
        caro: prod,
        barato: prod,
      };
    } else {
      if (prod.price > productosPorCategoria[prod.category].caro.price) {
        productosPorCategoria[prod.category].caro = prod;
      }
      if (prod.price < productosPorCategoria[prod.category].barato.price) {
        productosPorCategoria[prod.category].barato = prod;
      }
    }
  });

  // Calcular promedio rating general
  const ratingPromedioGeneral = productos.length > 0
    ? productos.reduce((acc, prod) => acc + prod.rating, 0) / productos.length
    : 0;

  // Calcular promedio rating por categoría
  const sumaRatingPorCategoria = {};
  const conteoRatingPorCategoria = {};
  productos.forEach(prod => {
    sumaRatingPorCategoria[prod.category] = (sumaRatingPorCategoria[prod.category] || 0) + prod.rating;
    conteoRatingPorCategoria[prod.category] = (conteoRatingPorCategoria[prod.category] || 0) + 1;
  });
  const ratingPromedioPorCategoria = {};
  for (const cat in sumaRatingPorCategoria) {
    ratingPromedioPorCategoria[cat] = sumaRatingPorCategoria[cat] / conteoRatingPorCategoria[cat];
  }

  return (
    <section className="mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Estadísticas</h2>
      <ul className="space-y-2 text-sm sm:text-base">
        <li><strong>Productos encontrados:</strong> {productos.length}</li>
        <li><strong>Precio promedio:</strong> ${precioPromedio.toFixed(2)}</li>
        <li><strong>Precio máximo:</strong> ${precioMaximo}</li>
        <li><strong>Precio mínimo:</strong> ${precioMinimo}</li>
        <li><strong>Productos con stock &gt; 50:</strong> {productosConStockAlto}</li>
        <li><strong>Productos con rating &gt; 4.5:</strong> {productosConBuenRating}</li>
        <li><strong>Rating promedio general:</strong> {ratingPromedioGeneral.toFixed(2)}</li>
      </ul>

      <h3 className="mt-6 text-xl font-semibold">Por categoría:</h3>
      {Object.keys(precioPromedioPorCategoria).map(cat => (
        <div key={cat} className="mt-3">
          <h4 className="font-semibold">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
          <ul className="text-sm sm:text-base ml-4">
            <li>Cantidad de productos: {conteoPorCategoria[cat]}</li>
            <li>Precio promedio: ${precioPromedioPorCategoria[cat].toFixed(2)}</li>
            <li>Producto más caro: {productosPorCategoria[cat].caro.title} (${productosPorCategoria[cat].caro.price})</li>
            <li>Producto más barato: {productosPorCategoria[cat].barato.title} (${productosPorCategoria[cat].barato.price})</li>
            <li>Rating promedio: {ratingPromedioPorCategoria[cat].toFixed(2)}</li>
          </ul>
        </div>
      ))}
    </section>
  );
};

export default PanelEstadisticas;
