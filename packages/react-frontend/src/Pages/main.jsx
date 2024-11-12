import React from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/Main.css';

const Main = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Navigation Bar */}
            <header className="navbar">
                <div className="nav-buttons">
                    <button onClick={() => navigate('/login')} className="nav-btn">Sign In</button>
                    <button onClick={() => navigate('/create-account')} className="nav-btn">Create Account</button>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="intro-section">
                <h1>Welcome to Our Website</h1>
                <p>
                    Discover a new way to manage and organize your tasks efficiently. Our platform is designed 
                    to provide you with the best tools for productivity, collaboration, and task tracking.
                </p>
                <button onClick={() => navigate('/create-account')} className="get-started-btn">
                    Get Started
                </button>
            </main>
        </div>
    );
};

export default Main;