import React, { useState, useEffect } from 'react';
import api from "../api";
import { useParams } from 'react-router-dom';

function StarRating() {
  // State to manage the visual hover effect on stars
  const [hoverRating, setHoverRating] = useState(0);
  // Get product primary key from URL parameters
  const { pk } = useParams();

  // State to store the current average rating displayed
  const [displayRating, setDisplayRating] = useState(0);
  // State to store the total number of ratings received
  const [numberOfRatings, setNumberOfRatings] = useState(0);

  // useEffect hook to fetch initial product data (number of ratings and current rating)
  // Runs once on component mount
  useEffect(() => {
    fetchProductDetails();
  }, [pk]); // Dependency on 'pk' ensures re-fetch if product ID changes

  // Function to fetch product details (rating and number_of_ratings)
  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`api/products/${pk}/`);
      if (response.data) {
        console.log("Product details fetched:", response.data);
        setDisplayRating(response.data.rating);
        setNumberOfRatings(response.data.number_of_ratings);
      } else {
        console.error("Product details not found or data is invalid for PK:", pk);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Handler for when a user clicks on a star to set a new rating
  const handleRatingClick = async (value) => {
    // Calculate the new count of ratings (increment by 1)
    const newCount = numberOfRatings + 1;

    try {
      // Send the new rating and updated count to the backend
      // CRITICAL FIX: Ensure 'number_of_ratings' sends 'newCount', not a hardcoded value
      const response = await api.patch(`api/products/${pk}/rate/`, {
        'new_rating': value,
        'number_of_ratings': newCount // Corrected: send the calculated newCount
      });

      if (response.status === 201 || response.status === 200) {
        console.log("Rating successful:", value, " | New count:", newCount);
        await fetchProductDetails();
      } else {
        console.error("Failed to update product rating. Status:", response.status);
        // Consider displaying a user-friendly error message on the UI
      }
    } catch (err) {
      console.error("Error during rating submission:", err);
      if (err.response) {
        console.error("Response error data:", err.response.data);
        console.error("Response status:", err.response.status);
      } else if (err.request) {
        console.error("Request error:", err.request);
      }
      // Consider displaying a user-friendly error message on the UI
    }
  };

  // Handler for mouse entering a star (hover effect)
  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  // Handler for mouse leaving the stars area (reset hover effect)
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div>
      <p>Rate this product</p>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          style={{
            // Apply 'gold' color if the star's value is less than or equal to
            // the currently hovered rating OR the actual display rating.
            // Hover takes precedence over display rating for visual feedback.
            color: value <= (hoverRating || displayRating) ? 'gold' : '#ddd',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={() => handleRatingClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
      {/* Optionally display the number of ratings */}
    </div>
  );
}

export default StarRating;
