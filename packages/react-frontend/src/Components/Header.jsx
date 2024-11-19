import React from "react";
import "../CSS/Header.css";
import { useNavigate } from "react-router-dom";
import DigitalClock from "./DigitalClock.jsx";

export function Header({ isSidebarOpen, toggleSidebar, userName }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <header className="header">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? "Hide" : "Show"}
      </button>
      <h1 className="header-title">Team One App - Welcome {userName}</h1>
      <div className="header-right-section">
        <DigitalClock />
        <button className="link-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;
