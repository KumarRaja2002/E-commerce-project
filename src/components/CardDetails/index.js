import React from 'react';
import './index.css'; // Optional: You can add custom styling for the card details

const CardDetails = ({ product, onClose }) => {
  return (
    <div className="card-details-overlay">
      <div className="card-details-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <img src={product.image_url} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Rating:</strong> {product.rating}★</p>
        <p><strong>About:</strong> {product.about}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Availability:</strong> {product.available ? 'In Stock' : 'Out of Stock'}</p>
      </div>
    </div>
  );
};

export default CardDetails;
