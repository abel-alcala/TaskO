import React from 'react';
import '../CSS/Header.css';
import {useNavigate} from "react-router-dom";

export function Header({isSidebarOpen, toggleSidebar}) {
    const navigate = useNavigate();

    const handleGoLogin = () => {
        navigate('/');
    };
    return (
        <header className="header">
            <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? 'Hide' : 'Show'}
            </button>
            <h1 className="header-title">Team One App</h1>
            <button className="link-btn" onClick={handleGoLogin}>Sign Out</button>
        </header>
    );
}

export default Header;
