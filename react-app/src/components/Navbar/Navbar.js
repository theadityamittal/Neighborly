import React from "react";
import "./Navbar.css";
import { FaBell, FaEnvelope } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Side: Neighbourly Logo */}
      <div className="navbar-left">
        <img src="/assets/neighbourly-logo.png" alt="Neighbourly Logo" className="logo" />
        <span className="logo-text">Neighbourly</span>
      </div>

      {/* Right Side: Icons & Profile */}
      <div className="navbar-right">
        <div className="icon-container">
          <FaEnvelope className="icon" />
        </div>
        <div className="icon-container">
          <FaBell className="icon" />
        </div>

        {/* Profile Image & Name */}
        <div className="user-name">
          <span className="username">Peter Smith</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
