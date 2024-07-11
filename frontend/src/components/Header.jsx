import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">VideoPlatform</div>
      <ul className="navbar-nav">
        {isAuthenticated && (
          <li className="nav-item">
            <NavLink to="/" activeclassname="active">
              Home
            </NavLink>
          </li>
        )}
        {isAuthenticated && user && user.role === "admin" && (
          <li className="nav-item">
            <NavLink to="/upload" activeclassname="active">
              Upload
            </NavLink>
          </li>
        )}
        {!isAuthenticated ? (
          <>
            <li className="nav-item">
              <NavLink to="/login" activeclassname="active">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" activeclassname="active">
                Sign Up
              </NavLink>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <NavLink
              style={{ backgroundColor: "orange" }}
              onClick={handleLogout}
            >
              Logout
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Header;
