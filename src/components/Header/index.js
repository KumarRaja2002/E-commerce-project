// import React, { useState, useEffect } from 'react';
// import {jwtDecode} from 'jwt-decode'; // Default import for jwt-decode
// import Cookies from 'js-cookie'; // Import js-cookie for managing cookies
// import './index.css'; // Your stylesheet
// import logo from '../../images/ecommerce-logo-png-favpng-c9XwFQHwsmZeVNHU6BRWQgabB-removebg-preview.png'; // Your logo image
// import { useHistory } from 'react-router-dom'; // For navigation

// const Header = () => {
//   const [products, setProducts] = useState([]); // Stores all products
//   const [searchTerm, setSearchTerm] = useState(''); // Stores the search input
//   const [filteredProducts, setFilteredProducts] = useState([]); // Stores filtered products
//   const [showSearchResults, setShowSearchResults] = useState(false); // Toggle search results dropdown
//   const [userType, setUserType] = useState(null); // User type (Admin or regular user)
//   const history = useHistory(); // For navigation

//   // Fetch products from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const accessToken = Cookies.get('jwt_token'); // Get access token from cookies
//         if (accessToken) {
//           const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`, {
//             headers: {
//               Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
//             },
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setProducts(data); // Store the fetched products
//           } else {
//             console.error('Failed to fetch products');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []); // Run once on component mount

//   // Check user role based on token
//   useEffect(() => {
//     const token = Cookies.get('jwt_token'); // Get the access token from cookies
//     if (token) {
//       try {
//         if (token.split('.').length === 3) { // Ensure it's a valid JWT token
//           const decoded = jwtDecode(token); // Decode the JWT token
//           setUserType(decoded.user_type); // Set the user type from the token
//         } else {
//           console.error('Invalid JWT token format');
//           setUserType(null);
//         }
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         setUserType(null); // In case of invalid or expired token
//       }
//     } else {
//       setUserType(null); // No token found
//     }
//   }, []); // Run once on component mount

//   // Handle logout
//   const handleLogout = () => {
//     Cookies.remove('jwt_token'); // Remove JWT token from cookies
//     history.replace('/login'); // Redirect to the login page
//   };

//   // Filter products based on the search term
//   const handleSearchChange = (event) => {
//     const searchValue = event.target.value.toLowerCase();
//     setSearchTerm(searchValue);

//     if (searchValue.trim()) {
//       const filtered = products.filter((product) =>
//         product.name.toLowerCase().includes(searchValue) // Filter products by name
//       );
//       setFilteredProducts(filtered);
//       setShowSearchResults(true); // Show search results
//     } else {
//       setShowSearchResults(false); // Hide search results if input is empty
//     }
//   };

//   // Handle product selection (when a user clicks on a product)
//   const handleProductClick = (productId) => {
//     console.log(`Navigating to product with ID: ${productId}`);
//     // Add navigation logic here (e.g., React Router's `useNavigate`)
//     setShowSearchResults(false); // Hide search results after selection
//     setSearchTerm(''); // Clear the search input
//   };

//   return (
//     <header className="header-container">
//       <div className="logo">
//         <img src={logo} alt="Ecommerce Logo" className="logo-image" />
//       </div>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search for products..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           className="search-input"
//         />
//         {showSearchResults && (
//           <div className="search-results">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   className="search-item"
//                   onClick={() => handleProductClick(product.id)} // Click handler for product selection
//                 >
//                   {product.name}
//                 </div>
//               ))
//             ) : (
//               <div className="search-item">No products found</div>
//             )}
//           </div>
//         )}
//       </div>
//       <nav className="nav-links">
//         <a href="/account">Account</a>
//         <a href="/cart">Cart</a>
//         {userType === 'ADMIN' && <a href="/admin">Admin Settings</a>} {/* Admin link */}
//         <button onClick={handleLogout} className="logout-button">
//           Logout
//         </button>
//       </nav>
//     </header>
//   );
// };

// export default Header;

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
