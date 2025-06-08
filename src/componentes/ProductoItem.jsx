// 📁 src/componentes/ProductoItem.jsx
function ProductoItem({ producto }) {
  return (
    <div className="border rounded-xl p-4 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <img
        src={producto.imagenURL || producto.thumbnail}
        alt={producto.title}
        className="w-full h-48 object-cover rounded-md mb-2"
      />
      {producto.imagenURL && (
        <p className="text-xs text-gray-500 mt-1 italic">Imagen vía Pixabay</p>
      )}
      <h3 className="text-xl font-bold mb-1 dark:text-white">{producto.title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{producto.description}</p>
      <p className="mt-2 font-semibold text-blue-700 dark:text-blue-300">Precio: ${producto.price}</p>
    </div>
  );
}

export default ProductoItem;