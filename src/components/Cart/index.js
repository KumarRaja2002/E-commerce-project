import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './index.css'; // Updated styles

const Cart = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      const token = Cookies.get('jwt_token');

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/carts`, {
          headers: { Authorization: `${token}` },
        });

        if (Array.isArray(response.data)) {
          setCarts(response.data);

          // Fetch product details for all cart items
          const productIds = response.data.map(cart => cart.product_id);
          const productRequests = productIds.map(id =>
            axios.get(`${process.env.REACT_APP_BASE_URL}/products/${id}`, {
              headers: { Authorization: `${token}` },
            })
          );

          const productResponses = await Promise.all(productRequests);

          const productData = {};
          productResponses.forEach((res, index) => {
            productData[productIds[index]] = res.data;
          });

          setProducts(productData);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching carts:', err);
        setError('Failed to load carts.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  useEffect(() => {
    if (carts.length > 0 && visibleCount < carts.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 400); // Render one item every 400ms

      return () => clearTimeout(timer);
    }
  }, [visibleCount, carts]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Loading carts...</p>
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;

  return (
   
    <div className="cart-container">
       <h1> Your cart items</h1>
      {carts.length === 0 ? (
        <p className="empty-cart">You have no items in your cart.</p>
      ) : (
        <div className="cart-list">
          {carts.slice(0, visibleCount).map(cart => {
            const product = products[cart.product_id];

            return (
              <div key={cart.id} className="cart-item">
                {product && product.data.image_url && (
                  <div className="product-image-cart">
                    <img src={product.data.image_url} alt={product.data.name} />
                  </div>
                )}
                <div className="cart-details">
                  <h3>{product ? product.data.name : 'Product'}</h3>
                  <p className="cart-info">Quantity: <span>{cart.quantity}</span></p>
                  <p className="cart-info">Total Price: <span>${cart.total_price ?? 'N/A'}</span></p>
                  <p className="cart-info note">Note: {cart.note ? cart.note : 'No note available'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
