// 📁 src/componentes/ListaProductos.jsx
import ProductoItem from "./ProductoItem";

function ListaProductos({ productos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productos.map((producto) => (
        <ProductoItem key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ListaProductos;