import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import "../CSS/ForgotPass.css";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Configure EmailJS parameters
      const serviceID = "service_kgdf029";
      const templateID = "template_jb85t6h";
      const publicKey = "te34eQlfNWL2xZ92U";

      emailjs
        .send(serviceID, templateID, { to_email:email }, publicKey)
        .then((response) => {
          console.log("Email sent successfully:", response);
          setMessage("Password reset link sent to email.");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setMessage("An error occurred. Please try again.");
        });
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
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="reset-pass-btn">
          Send Reset Link
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPass;
