import React, { useEffect, useState } from "react";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState([]);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  const toggleSignup = () =>
    setActiveModal(activeModal === "signup" ? null : "signup");
  const toggleLogin = () =>
    setActiveModal(activeModal === "login" ? null : "login");

  const fetchData = () => {
    let url = "http://localhost:3001/api/products";
    if (sort || filter.length > 0) {
      url += "?";
      if (sort) url += `sort=${sort}&`;
      if (filter.length > 0) url += `category=${filter.join(",")}`;
    }

    const token = localStorage.getItem("token");
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching data: ", error));
  };

  useEffect(() => {
    fetchData();
  }, [sort, filter]);

  const showDetails = (product) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    fetchData();
    fetchCartData(); // Add this line here
  }, []); // This `useEffect` runs only once when the component mounts

  const fetchCartData = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/cart/1", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCart(data))
      .catch((error) => console.error("Error fetching cart data: ", error));
  };

  const addToCart = (product) => {
    const token = localStorage.getItem("token");

    const payload = {
      user_id: 1, // Replace this with the actual user ID
      product_id: product.id,
      quantity: 1, // Starting with a quantity of 1, adjust as needed
    };

    fetch("http://localhost:3001/api/cart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the local state to include the new cart item
        setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
      })
      .catch((error) => console.error("Error adding to cart: ", error));
  };

  const onQuantityChange = (itemId, newQuantity) => {
    // Step 1: Update local state
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);

    // Step 2: Make API call to update the database
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/api/cart/${itemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response, e.g., error handling or refreshing data
      })
      .catch((error) => console.error("Error updating cart item: ", error));
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const removeFromCart = (itemId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/api/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) // Removed the semicolon here
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        fetchCartData(); // Refresh cart data
      })
      .catch((error) => console.error("Error removing cart item: ", error));
  };

  const checkout = () => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/api/checkout/1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        fetchCartData(); // Refresh cart data
      })
      .catch((error) => console.error("Error during checkout: ", error));
  };

  return (
    <div className="container mx-auto relative">
      <div>
        <Navbar toggleSignup={toggleSignup} toggleLogin={toggleLogin} />
        {activeModal === "signup" && (
          <SignupModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "login" && (
          <LoginModal onClose={() => setActiveModal(null)} />
        )}
      </div>
      <div className="absolute top-4 right-0 bg-lime-500 text-neutral-900 rounded-full w-10 h-10 flex items-center justify-center">
        {cart.length}
      </div>
      <div className="text-neutral-300 p-4">
        <h1 className="text-4xl font-bold mb-4">Product List</h1>
        <Cart
          cartItems={cart}
          onQuantityChange={onQuantityChange} // Pass the function here
          onRemoveItem={removeFromCart}
          onCheckout={checkout}
        />
        <div className="mb-4">
          <label className="mr-2">Sort By:</label>
          <select
            onChange={handleSortChange}
            className="appearance-none bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
          >
            <option value="">None</option>
            <option value="price_asc">Price Ascending</option>
            <option value="price_desc">Price Descending</option>
          </select>

          <div>
            <label className="mr-2">Filter Category:</label>
            <input
              type="checkbox"
              value="Electronics"
              onChange={handleFilterChange}
            />{" "}
            Electronics
            <input
              type="checkbox"
              value="Furniture"
              onChange={handleFilterChange}
            />{" "}
            Furniture
            <input
              type="checkbox"
              value="Accessories"
              onChange={handleFilterChange}
            />{" "}
            Accessories
          </div>
        </div>
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
                <button
                  className="mt-2 bg-lime-500 text-neutral-900 rounded px-4 py-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering 'showDetails'
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
