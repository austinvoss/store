import React from "react";

function Cart({ cartItems }) {
  return (
    <div className="bg-neutral-700 rounded-lg p-4 mb-4">
      <h2 className="text-3xl font-semibold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
