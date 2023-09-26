import React from "react";
import Login from "./Login";

const LoginModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <Login onClose={onClose} />
      </div>
    </div>
  );
};

export default LoginModal;
