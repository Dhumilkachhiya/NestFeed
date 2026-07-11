import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  MarkerClustererF,
} from "@react-google-maps/api";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Default center: Ahmedabad, India
const defaultCenter = {
  lat: 23.0225,
  lng: 72.5714,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const PropertyMap = ({
  properties = [],
  onBoundsChanged,
  selectedPropertyId,
  onPropertySelect,
  center,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const boundsTimeoutRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleBoundsChanged = useCallback(() => {
    // Debounce to avoid excessive API calls
    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
    }
    setShowSearchArea(true);
  }, []);

  const handleSearchThisArea = useCallback(() => {
    if (!mapRef.current || !onBoundsChanged) return;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    onBoundsChanged({
      swLat: sw.lat(),
      swLng: sw.lng(),
      neLat: ne.lat(),
      neLng: ne.lng(),
    });

    setShowSearchArea(false);
  }, [onBoundsChanged]);

  // Fit map to properties when they change
  useEffect(() => {
    if (!mapRef.current || properties.length === 0) return;

    const validProperties = properties.filter(
      (p) =>
        p.coordinates?.coordinates?.[0] !== 0 ||
        p.coordinates?.coordinates?.[1] !== 0
    );

    if (validProperties.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    validProperties.forEach((p) => {
      bounds.extend({
        lat: p.coordinates.coordinates[1],
        lng: p.coordinates.coordinates[0],
      });
    });

    mapRef.current.fitBounds(bounds, { padding: 60 });
  }, [properties]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
        <p>Error loading Google Maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="animate-pulse text-gray-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center || defaultCenter}
        zoom={12}
        options={mapOptions}
        onLoad={onLoad}
        onDragEnd={handleBoundsChanged}
        onZoomChanged={handleBoundsChanged}
      >
        {/* Property Markers with Clustering */}
        <MarkerClustererF>
          {(clusterer) => (
            <>
              {properties.map((property) => {
                const lng = property.coordinates?.coordinates?.[0];
                const lat = property.coordinates?.coordinates?.[1];
                if (!lat || !lng || (lat === 0 && lng === 0)) return null;

                const isSelected = selectedPropertyId === property._id;

                return (
                  <MarkerF
                    key={property._id}
                    position={{ lat, lng }}
                    clusterer={clusterer}
                    onClick={() => {
                      setActiveMarker(property._id);
                      onPropertySelect?.(property._id);
                    }}
                    label={{
                      text: `₹${
                        property.price >= 10000000
                          ? (property.price / 10000000).toFixed(1) + "Cr"
                          : property.price >= 100000
                          ? (property.price / 100000).toFixed(0) + "L"
                          : property.price.toLocaleString()
                      }`,
                      color: isSelected ? "#ffffff" : "#1e40af",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      fillColor: isSelected ? "#1e40af" : "#ffffff",
                      fillOpacity: 1,
                      strokeColor: "#1e40af",
                      strokeWeight: 2,
                      scale: 20,
                    }}
                  />
                );
              })}
            </>
          )}
        </MarkerClustererF>

        {/* Info Window for Active Marker */}
        {activeMarker &&
          (() => {
            const property = properties.find((p) => p._id === activeMarker);
            if (!property) return null;
            const lng = property.coordinates?.coordinates?.[0];
            const lat = property.coordinates?.coordinates?.[1];

            return (
              <InfoWindowF
                position={{ lat, lng }}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div className="max-w-[240px] p-1">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="font-bold text-sm text-gray-900 truncate">
                    {property.title}
                  </h3>
                  <p className="text-blue-600 font-bold text-sm mt-1">
                    ₹{property.price?.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <FaBed /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBath /> {property.bathrooms}
                    </span>
                    {property.area && <span>{property.area} sqft</span>}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-gray-400 mt-1 truncate">
                    <FaMapMarkerAlt className="text-blue-400" />
                    {property.location}
                  </p>
                  {property.distanceKm !== undefined && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      {property.distanceKm} km away
                    </p>
                  )}
                </div>
              </InfoWindowF>
            );
          })()}
      </GoogleMap>

      {/* "Search This Area" Button */}
      {showSearchArea && (
        <button
          onClick={handleSearchThisArea}
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all z-10 cursor-pointer"
        >
          🔍 Search This Area
        </button>
      )}
    </div>
  );
};

export default PropertyMap;
