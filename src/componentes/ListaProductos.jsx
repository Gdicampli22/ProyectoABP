function ListaProductos({ productos }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="border p-4 m-2 rounded shadow bg-white hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{producto.title}</h2>
          <p className="text-green-700 font-bold">Precio: ${producto.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;
