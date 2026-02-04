import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import { useAuth } from '../../context/AuthContext'
function Navbar({ logo, links = []}) {
	const{user,logout}=useAuth();
	return (
		<nav className="app-navbar">
			<div className="nav-left">
				{logo ? (
					<img src={logo} alt="logo" className="nav-logo" />
				) : (
					<span className="nav-logo-text">MyApp</span>
				)}
			</div>

			<ul className="nav-links">
				{links.map((l) => (
					<li key={l.to || l.label} className="nav-item">
						<Link to={l.to || '#'} className="nav-link">
							{l.label}
						</Link>
					</li>
				))}
			</ul>

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
	)
}

export default Navbar

