import React, { useState } from "react";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaParking,
  FaCouch,
} from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PropertyCard = ({ property, compact }) => {
  const [liked, setLiked] = useState(false);
  const {
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    images,
    area,
    status,
    propertyType,
    furnished,
    parking,
  } = property;

  // Status badge colors
  const statusColors = {
    "For Sale": "bg-green-100 text-green-700",
    Rent: "bg-blue-100 text-blue-700",
    Sold: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group cursor-pointer relative ${
        compact ? "" : ""
      }`}
    >
      {/* Image Carousel */}
      <div className="relative">
        <Carousel
          showThumbs={false}
          showStatus={false}
          dynamicHeight={false}
          className={compact ? "h-48 overflow-hidden" : "h-60 overflow-hidden"}
        >
          {(images || []).map((img, index) => (
            <div key={index} className={compact ? "h-48" : "h-60"}>
              <img
                src={img}
                alt={title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </Carousel>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-all cursor-pointer"
        >
          {liked ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 text-lg" />
          )}
        </button>

        {/* Status Badge */}
        {status && (
          <span
            className={`absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full ${
              statusColors[status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 z-10 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-base shadow-md">
          ₹{price?.toLocaleString("en-IN") || "N/A"}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate flex-1">
            {title}
          </h3>
          {propertyType && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md shrink-0">
              {propertyType}
            </span>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="text-blue-500 shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        {/* Amenities Row */}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100 text-gray-700 text-sm">
          {bedrooms !== undefined && (
            <span className="flex items-center gap-1.5">
              <FaBed className="text-gray-400" /> {bedrooms} Bed
            </span>
          )}
          {bathrooms !== undefined && (
            <span className="flex items-center gap-1.5">
              <FaBath className="text-gray-400" /> {bathrooms} Bath
            </span>
          )}
          {area && <span className="text-gray-500">{area} sqft</span>}
          {parking && (
            <span className="flex items-center gap-1.5 text-green-600">
              <FaParking /> Parking
            </span>
          )}
        </div>

        {/* Tags */}
        {furnished && furnished !== "Unfurnished" && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
              <FaCouch className="text-xs" /> {furnished}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;