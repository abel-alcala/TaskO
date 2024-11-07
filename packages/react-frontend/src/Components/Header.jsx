import React from 'react';
import '../CSS/Header.css';

export function Header({ isSidebarOpen, toggleSidebar }) {
    return (
        <header className="header">
            <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? 'Hide' : 'Show'}
            </button>
            <h1 className="header-title">Team One App</h1>
        </header>
    );
}

export default Header;
