import React from "react";

function Cart({ cartItems, onQuantityChange, onRemoveItem, onCheckout }) {
  return (
    <div className="bg-neutral-700 rounded-lg p-4 mb-4">
      <h2 className="text-3xl font-semibold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - Quantity:
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => onQuantityChange(item.id, e.target.value)}
                className="appearance-none bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
              />
              <button onClick={() => onRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default Cart;
