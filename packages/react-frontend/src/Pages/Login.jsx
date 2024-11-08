import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Login.css';


const Login = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div>
            <h1>Welcome Back!</h1>
            <h2>Please Log-in</h2>
            <form className="login-forms">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <br/>
                <div className="btn-container">
                    <button className="create-btn">Create Account</button>
                    <button className="forgot-btn">Forgot Password</button>
                </div>
                <button className="login-btn" type="submit">Login</button>
                <button className="link-btn" onClick={handleGoHome}>Go to Home</button>
            </form>
        </div>
    );
};

export default Login;