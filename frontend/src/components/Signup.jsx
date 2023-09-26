import React, { useState } from "react";

function Signup({ onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log("User registered:", data);
        // TODO: Redirect user or show a success message
      } else {
        console.log("Failed to register");
        // TODO: Show an error message
      }
    } catch (error) {
      console.error("There was a problem registering the user", error);
      // TODO: Show an error message
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
      <h1 className="text-4xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-neutral-700 text-neutral-300 border rounded py-2 px-4 focus:outline-none focus:border-lime-500"
          />
        </div>
        <button
          type="submit"
          className="bg-lime-500 text-neutral-900 rounded px-4 py-2"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
