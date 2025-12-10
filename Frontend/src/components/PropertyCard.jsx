import React, { useState } from 'react';
import { FaBed, FaBath, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PropertyCard = ({ property }) => {
  const [liked, setLiked] = useState(false);
  const { title, price, location, bedrooms, bathrooms, images, area } = property;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      {/* Image Carousel */}
      <Carousel showThumbs={false} dynamicHeight>
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={title} className="h-48 object-cover" />
          </div>
        ))}
      </Carousel>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">${price.toLocaleString()}</h3>
          <button 
            onClick={() => setLiked(!liked)} 
            className={`text-xl ${liked ? 'text-red-500' : 'text-gray-400'}`}
          >
            <FaHeart />
          </button>
        </div>

        <h4 className="text-gray-600 mt-2">{title}</h4>
        <p className="flex items-center gap-1 text-gray-500">
          <FaMapMarkerAlt /> {location}
        </p>

        {/* Amenities */}
        <div className="flex gap-4 mt-4 text-gray-600">
          <span className="flex items-center gap-1">
            <FaBed /> {bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <FaBath /> {bathrooms}
          </span>
          <span>{area} sqft</span>
        </div>

        {/* Contact Agent Button */}
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Contact Agent
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;