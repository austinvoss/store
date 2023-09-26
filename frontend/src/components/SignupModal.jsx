import React from "react";
import Signup from "./Signup";

const SignupModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <Signup onClose={onClose} />
      </div>
    </div>
  );
};

export default SignupModal;
