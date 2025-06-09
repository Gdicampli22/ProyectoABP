// ProductoItem.jsx
import React from "react";

const ProductoItem = ({ producto }) => {
  return (
    <article className="border rounded shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-700">
      <img
        src={producto.imagenURL || producto.thumbnail}
        alt={producto.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{producto.title}</h3>
        <p className="text-sm mb-2">{producto.description}</p>
        <p><strong>Precio:</strong> ${producto.price}</p>
        <p><strong>Rating:</strong> {producto.rating}</p>
        <p><strong>Stock:</strong> {producto.stock}</p>
        <p><strong>Categoría:</strong> {producto.category}</p>
      </div>
    </article>
  );
};

export default ProductoItem;
