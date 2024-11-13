import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/ChangePass.css";

const ChangePass = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

// Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handlePassChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            setMessage("Password do not match!");
            return            
        }

        try {
            const response = await fetch("{api link}", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                setMessage("Password has been reset successfully.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage("Failed to reset password.");
            }
            } catch (error) {
                setMessage("An error occurred. Please try again later.");
        }
        
    };

  return (
    <div className="change-pass">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit} className="change-pass-form">
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={password}
          onChange={handlePassChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPassChange}
          required
        />
        
        <button type="submit" className="change-pass-btn">
          Reset Password
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ChangePass;
