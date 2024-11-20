import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserManage.jsx";
import "../CSS/Login.css";
import { api } from "../ApiFunctions.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(formData.userName, formData.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.userName);
      login(data);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Welcome Back!</h1>
      <h2>Please Log-in</h2>
      <form className="login-forms" onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <div className="btn-container">
          <button
            type="button"
            className="create-btn"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
          <button
            type="button"
            className="forgot-btn"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </button>
        </div>
        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
