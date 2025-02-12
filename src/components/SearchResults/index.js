import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './index.css';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('query')?.toLowerCase() || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const history = useHistory();

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : data.data || []);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  // Handle the navigation to the product detail page using history.push
  const handleViewMore = (productId) => {
    history.push(`/products/${productId}`); // Navigate to the product detail page
  };

  return (
    <div className="search-results-page">
      <h2>
        Here are some of the products you are looking for{' '}
        <span style={{ color: 'green', fontWeight: 'bold' }}>
          {searchTerm}
        </span>
      </h2>

      {/* Show loading spinner while products are being fetched */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <div className="product-list">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <h3>{product.name}</h3>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Rating:</strong> ⭐ {product.rating}</p>
                  <div>
                    <button onClick={() => handleViewMore(product.id)} className="view-more-btn">
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
