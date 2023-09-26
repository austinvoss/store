import React from "react";

const Navbar = ({ toggleSignup, toggleLogin }) => {
  return (
    <nav>
      <button onClick={toggleSignup}>Sign Up</button>
      <button onClick={toggleLogin}>Log In</button>
    </nav>
  );
};

export default Navbar;
