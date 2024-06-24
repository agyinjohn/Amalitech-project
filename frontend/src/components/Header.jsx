import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">VideoPlatForm</div>
      <ul className="navbar-nav">
        <li className="nav-item"></li>
        <li className="nav-item">
          <NavLink to="/" activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/upload" activeClassName="active">
            Upload
          </NavLink>
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/signup" activeClassName="active">
            Sign Up
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
