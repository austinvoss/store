import React, { useState } from "react";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT in local storage
        localStorage.setItem("token", data.token);
        // Redirect to a secure page or update the UI to show the user is logged in
      } else {
        // Show error message
        console.log("Invalid email or password");
      }
    } catch (error) {
      console.error("There was an error logging in", error);
    }
  };

  return (
    <div className="bg-neutral-700 rounded-lg p-4">
      <button
        onClick={onClose}
        className="bg-lime-500 text-neutral-900 rounded px-4 py-2"
      >
        Close
      </button>
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
          />
        </div>
        <button
          type="submit"
          className="bg-lime-500 text-neutral-900 rounded px-4 py-2"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
