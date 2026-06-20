import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-nav">
        <span className="navbar-brand">Event Management</span>
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div className="navbar-nav">
        <span className="navbar-text">Signed in as: {user.username}</span>
        <button className="btn-signout" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
