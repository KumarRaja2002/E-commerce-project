import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import Cookies from 'js-cookie';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details', error);
        setLoading(false);
      });
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.data.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    
    const token = Cookies.get('jwt_token');
    console.log("JWT Token:", token);

    if (!token) {
      alert("You are not logged in! Please log in first.");
      setCartLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/carts`,
        {
          productId: product.data.id,
          quantity,
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart', error);
      alert(error?.response?.data?.message || 'Failed to add product to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="error">Product not found.</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-header">
        <h1>{product.name}</h1>
        <p className="category">{product.data.category}</p>
      </div>
      <div className="product-body">
        <div className="product-image">
          <img src={product.data.image_url} alt={product.data.name} />
        </div>
        <div className="product-info">
          <p className="price">Price: ${product.data.price}</p>
          <p className="rating">Rating: {product.data.rating}★</p>
          <p className="stock">Stock: {product.data.quantity} units</p>
          <p className="about">{product.data.about}</p>

          <div className="quantity-selector">
            <button onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity} disabled={quantity >= product.data.quantity}>+</button>
          </div>

          {/* Separate container for buttons */}
          <div className="buttons-container">
            <button 
              className="add-to-cart" 
              onClick={handleAddToCart} 
              disabled={cartLoading}
            >
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
