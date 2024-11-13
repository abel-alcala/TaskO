import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/ChangePass.css";

const ChangePass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

    const handleSubmit = (e) => {
      e.preventDefault();

      
    };

  return (
    <div className="change-pass">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit} className="change-pass-form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="change-pass-btn">
          Change Password
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangePass;
