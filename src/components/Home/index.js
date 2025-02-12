// Home.js
import React, { Component } from 'react';
import Slider from 'react-slick';
import Header from '../Header'; // Ensure the path to Header is correct
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import axios from 'axios';

// Image imports for carousel
import img1 from '../../images/caur-1.jpg';
import img2 from '../../images/caur-2.png';
import img3 from '../../images/caur-3.webp';
import img4 from '../../images/caur-4.jpg';

// Import category components
import HorizontalScroll from '../HorizontalScrolling';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {
        Accessories: [],
        Clothes: [],
        Utensils: [],
        Electronics: [],
      },
      offset: {
        Accessories: 0,
        Clothes: 0,
        Utensils: 0,
        Electronics: 0,
      },
      limit: 10,
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchAllCategories();
  }

  fetchAllCategories = () => {
    const categories = ['Accessories', 'Clothes', 'Utensils', 'Electronics'];
    categories.forEach((category) => this.fetchCategoryProducts(category));
  };

  fetchCategoryProducts = (category) => {
    const { offset, limit } = this.state;
    const currentOffset = offset[category] || 0;

    this.setState({ loading: true });

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/products?category=${category}&sort_by=price&sort_type=asc&offset=${currentOffset}&limit=${limit}`
      )
      .then((response) => {
        this.setState((prevState) => ({
          products: {
            ...prevState.products,
            [category]: [
              ...prevState.products[category],
              ...(response.data.data || []),
            ],
          },
          offset: {
            ...prevState.offset,
            [category]: currentOffset + limit,
          },
          loading: false,
        }));
      })
      .catch((error) => {
        console.error(`Error fetching ${category} products:`, error.message);
        this.setState({ loading: false });
      });
  };

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      swipeToSlide: true,
      touchMove: true,
      swipe: true,
      pauseOnHover: true,
    };

    const { products } = this.state;

    return (
      <div>
        <Header />
        <div className="home-container">
          <div className="carousel-container">
            <Slider {...settings}>
              <div>
                <img src={img1} alt="Slide 1" className="carousel-image" />
              </div>
              <div>
                <img src={img2} alt="Slide 2" className="carousel-image" />
              </div>
              <div>
                <img src={img3} alt="Slide 3" className="carousel-image" />
              </div>
              <div>
                <img src={img4} alt="Slide 4" className="carousel-image" />
              </div>
            </Slider>
          </div>

          <div className="category-section">
            <HorizontalScroll
              category="Accessories"
              products={products.Accessories}
              fetchMoreProducts={() => this.fetchCategoryProducts('Accessories')}
            />
            <HorizontalScroll
              category="Clothes"
              products={products.Clothes}
              fetchMoreProducts={() => this.fetchCategoryProducts('Clothes')}
            />
            <HorizontalScroll
              category="Utensils"
              products={products.Utensils}
              fetchMoreProducts={() => this.fetchCategoryProducts('Utensils')}
            />
            <HorizontalScroll
              category="Electronics"
              products={products.Electronics}
              fetchMoreProducts={() => this.fetchCategoryProducts('Electronics')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

