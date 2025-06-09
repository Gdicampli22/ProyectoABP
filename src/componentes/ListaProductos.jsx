// ListaProductos.jsx
import React from "react";
import ProductoItem from "./ProductoItem";

const ListaProductos = ({ productos }) => {
  if (productos.length === 0) {
    return <p className="text-center text-red-500">No se encontraron productos.</p>;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <ProductoItem key={producto.id} producto={producto} />
      ))}
    </section>
  );
};

export default ListaProductos;
