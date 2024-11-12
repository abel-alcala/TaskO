import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/CreateAcc.css";

const CreateAcc = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: ''});
  const [error, setError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } =  e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password != formData.confirmPassword){
        setError("Password do not match");
        return;
    }
    setError('');
    console.log("Account Created:", formData);
    navigate('/login');
  }

  return (
    <div className="create-acc">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className="create-acc-form">
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <button
          type="submit"
          className="create-acc-btn"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAcc;