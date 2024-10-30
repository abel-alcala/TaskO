import React from 'react';
import { useNavigate } from 'react-router-dom';



const Login = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form>
                <label>
                    Username:
                    <input type="text" name="username"/>
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" name="password"/>
                </label>
                <br/>
                <button type="submit">Login</button>
                <button onClick={handleGoHome}>Go to Home</button>
            </form>
        </div>
    );
};

export default Login;