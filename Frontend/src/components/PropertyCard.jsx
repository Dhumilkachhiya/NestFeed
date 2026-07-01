import React, { useState } from 'react';
import { FaBed, FaBath, FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PropertyCard = ({ property }) => {
  const [liked, setLiked] = useState(false);
  const { title, price, location, bedrooms, bathrooms, images, area } = property;

  return (
    <div className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group cursor-pointer relative">
      {/* Image Carousel */}
      <div className="relative">
        <Carousel showThumbs={false} showStatus={false} dynamicHeight={false} className="h-60 overflow-hidden">
          {images.map((img, index) => (
            <div key={index} className="h-60">
              <img src={img} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </Carousel>
        
        {/* Like Button Overlay */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }} 
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-all"
        >
          {liked ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-600 text-xl" />}
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-lg shadow-md">
          ${price?.toLocaleString() || "N/A"}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{title}</h3>
        <p className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <FaMapMarkerAlt className="text-blue-500" /> <span className="truncate">{location}</span>
        </p>

        {/* Amenities */}
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 text-gray-700">
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-1 font-semibold"><FaBed className="text-gray-400" /> {bedrooms}</span>
            <span className="text-xs text-gray-500">Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-1 font-semibold"><FaBath className="text-gray-400" /> {bathrooms}</span>
            <span className="text-xs text-gray-500">Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">{area}</span>
            <span className="text-xs text-gray-500">sqft</span>
          </div>
        </div>

        {/* Contact Agent Button */}
        <button 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            className="mt-5 w-full bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
        >
          Contact Agent
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;