import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/ForgotPass.css";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error sending email:", error);
        setMessage("An error occurred. Please try again.");
      }
    };

  return (
    <div className="forgot-pass">
      <h1>Forgot Password</h1>
      <p>Enter email address to reset your password</p>
      <form onSubmit={handleSubmit} className="forgot-pass-form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="reset-pass-btn">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPass;
