import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Use useHistory instead of useNavigate
import './index.css';

const HorizontalScroll = ({ category, products, fetchMoreProducts }) => {
  const history = useHistory(); // Initialize the useHistory hook
  const scrollContainer = useRef(null);

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      fetchMoreProducts();
    }
  };

  useEffect(() => {
    const container = scrollContainer.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewMoreClick = (id) => {
    // Use history.push() to navigate to the product details page
    history.push(`/products/${id}`);
  };

  return (
    <div className="horizontal-scroll">
      <h2>{category}</h2>
      <div className="scroll-container" ref={scrollContainer}>
        {products.map(({ id, image_url, name, price, rating }) => (
          <div key={id} className="product-card-1">
            <img src={image_url} alt={name} />
            <h3>{name}</h3>
            <p>Rating: {rating}★</p>
            <p>Price: ${price}</p>
            {/* Add the View More button */}
            <button onClick={() => handleViewMoreClick(id)}>View More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroll;
