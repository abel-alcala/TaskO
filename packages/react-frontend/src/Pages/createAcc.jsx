import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserManage.jsx";
import "../CSS/CreateAcc.css";
import { api } from "../ApiFunctions.jsx";

const CreateAcc = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await api.createAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      console.log(data);
      navigate("/login");
    } catch (err) {
      console.error("Account creation error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error creating your account";
      setError(errorMessage);
    }
  };

  return (
    <div className="create-acc">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className="create-acc-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />
        <button type="submit" className="create-acc-btn">
          Create Account
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateAcc;
