import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../context/AuthContext';

function Navbar({ logo, links = [] }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="app-navbar">
      {/* Hamburger / Toggle Button */}
      <div className="nav-right-label" onClick={() => setMenuOpen(prev => !prev)}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>

      {/* Logo */}
      <div className="nav-left">
        {logo ? (
          <img src={logo} alt="logo" className="nav-logo" />
        ) : (
          <span className="nav-logo-text">MyApp</span>
        )}
      </div>

      {/* Links */}
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {links.map((l) => (
          <li key={l.to || l.label} className="nav-item">
            <Link
              to={l.to || '#'}
              className="nav-link"
              onClick={() => setMenuOpen(false)} // auto close menu on link click
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Section */}
      <div className="nav-right">
        {user ? (
          <button className="nav-logout" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;