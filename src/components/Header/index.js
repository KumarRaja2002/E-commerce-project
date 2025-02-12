

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // For navigation
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './index.css';
import logo from '../../images/ecommerce-logo-png-favpng-c9XwFQHwsmZeVNHU6BRWQgabB-removebg-preview.png';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState(null);
  const history = useHistory(); // Router history for navigation

  // Check user role
  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token) {
      try {
        if (token.split('.').length === 3) {
          const decoded = jwtDecode(token);
          setUserType(decoded.user_type);
        } else {
          console.error('Invalid JWT token format');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('jwt_token');
    history.replace('/login');
  };

  // Handle search when Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      history.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="header-container">
      <div className="logo">
        <img src={logo} alt="Ecommerce Logo" className="logo-image" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for Enter key
          className="search-input"
        />
      </div>
      <nav className="nav-links">
        <a href="/account">Account</a>
        <a href="/carts">Cart</a>
        {userType === 'ADMIN' && <a href="/admin">Admin Settings</a>}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
