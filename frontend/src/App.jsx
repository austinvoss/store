import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const showDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="text-neutral-300 p-4">
      <h1 className="text-4xl font-bold mb-4">Product List</h1>
      {selectedProduct ? (
        <div className="bg-neutral-700 rounded-lg p-4">
          <h2 className="text-3xl font-semibold">{selectedProduct.name}</h2>
          <p className="text-neutral-400">${selectedProduct.price}</p>
          <p className="mt-4">{selectedProduct.description}</p>
          <button
            className="mt-4 bg-lime-500 text-neutral-900 rounded px-4 py-2"
            onClick={() => setSelectedProduct(null)}
          >
            Back to List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-neutral-700 rounded-lg p-4 hover:bg-neutral-600 cursor-pointer"
              onClick={() => showDetails(product)}
            >
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-neutral-400">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
