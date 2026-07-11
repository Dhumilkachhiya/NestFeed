import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import PropertyMap from "./PropertyMap";
import {
  Loader2,
  Search,
  SlidersHorizontal,
  X,
  MapPin,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api/v1/property";

const DisplayProp = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchMode, setSearchMode] = useState("all"); // "all" | "bounds" | "radius"

  // Search inputs
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    status: "",
    propertyType: "",
    furnished: "",
    parking: "",
  });

  // Radius search state
  const [radiusCenter, setRadiusCenter] = useState(null);
  const [radius, setRadius] = useState(5);

  // ─── Fetch All Properties (Initial Load) ──────────────
  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/getproperty`);
      if (res.data.success && Array.isArray(res.data.data)) {
        setProperties(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Bounds Search ("Search This Area") ───────────────
  const handleBoundsSearch = useCallback(
    async (bounds) => {
      try {
        setLoading(true);
        setSearchMode("bounds");

        const cleanFilters = {};
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== "" && val !== undefined) cleanFilters[key] = val;
        });

        const res = await axios.post(`${API_BASE}/search/bounds`, {
          ...bounds,
          ...cleanFilters,
        });

        if (res.data.success) {
          setProperties(res.data.data.properties);
        }
      } catch (error) {
        console.error("Bounds search error:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // ─── Radius Search (Landmark) ─────────────────────────
  const handleRadiusSearch = async () => {
    if (!radiusCenter) return;

    try {
      setLoading(true);
      setSearchMode("radius");

      const cleanFilters = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== "" && val !== undefined) cleanFilters[key] = val;
      });

      const res = await axios.post(`${API_BASE}/search/radius`, {
        lat: radiusCenter.lat,
        lng: radiusCenter.lng,
        radius,
        ...cleanFilters,
      });

      if (res.data.success) {
        setProperties(res.data.data.properties);
      }
    } catch (error) {
      console.error("Radius search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Handle Landmark Search via Google Geocoding ──────
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Use Google Geocoding API to resolve the search query to coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      searchQuery
    )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

    try {
      const res = await axios.get(geocodeUrl);
      if (res.data.results?.length > 0) {
        const { lat, lng } = res.data.results[0].geometry.location;
        setRadiusCenter({ lat, lng });

        // Now search properties near this location
        setLoading(true);
        setSearchMode("radius");

        const cleanFilters = {};
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== "" && val !== undefined) cleanFilters[key] = val;
        });

        const propRes = await axios.post(`${API_BASE}/search/radius`, {
          lat,
          lng,
          radius,
          ...cleanFilters,
        });

        if (propRes.data.success) {
          setProperties(propRes.data.data.properties);
        }
      }
    } catch (error) {
      console.error("Geocoding/search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Clear Filters ────────────────────────────────────
  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      status: "",
      propertyType: "",
      furnished: "",
      parking: "",
    });
    setSearchQuery("");
    setRadiusCenter(null);
    setSearchMode("all");
    fetchAllProperties();
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined
  ).length;

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] w-full overflow-hidden">
      {/* ─── Search Bar ───────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <form
          onSubmit={handleLocationSearch}
          className="flex-1 flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, landmark, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Radius Selector */}
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-gray-100 rounded-lg px-3 py-2.5 text-sm outline-none cursor-pointer"
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </form>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            showFilters || activeFilterCount > 0
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear All */}
        {(searchMode !== "all" || activeFilterCount > 0) && (
          <button
            onClick={clearFilters}
            className="text-red-500 text-sm font-medium hover:text-red-700 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ─── Filter Panel ─────────────────────────────── */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3 shrink-0">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none w-28"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none w-28"
          />
          <select
            value={filters.bedrooms}
            onChange={(e) =>
              setFilters({ ...filters, bedrooms: e.target.value })
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
            <option value="">Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
            <option value="">Status</option>
            <option value="For Sale">For Sale</option>
            <option value="Rent">Rent</option>
            <option value="Sold">Sold</option>
          </select>
          <select
            value={filters.propertyType}
            onChange={(e) =>
              setFilters({ ...filters, propertyType: e.target.value })
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
            <option value="">Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="House">House</option>
            <option value="Plot">Plot</option>
            <option value="Commercial">Commercial</option>
          </select>
          <select
            value={filters.furnished}
            onChange={(e) =>
              setFilters({ ...filters, furnished: e.target.value })
            }
            className="bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
            <option value="">Furnished</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.parking === "true"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  parking: e.target.checked ? "true" : "",
                })
              }
              className="rounded"
            />
            Parking
          </label>
        </div>
      )}

      {/* ─── Split-Screen Layout ──────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Property List */}
        <div className="w-full lg:w-[45%] xl:w-[40%] overflow-y-auto bg-gray-50 border-r border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {searchMode === "radius" && searchQuery
                  ? `Properties near "${searchQuery}"`
                  : searchMode === "bounds"
                  ? "Properties in this area"
                  : "All Properties"}
              </h2>
              <span className="text-sm text-gray-500">
                {properties.length} result{properties.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    onClick={() => setSelectedPropertyId(property._id)}
                    className={`rounded-2xl transition-all cursor-pointer ${
                      selectedPropertyId === property._id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <PropertyCard
                      property={property}
                      compact
                    />
                    {property.distanceKm !== undefined && (
                      <div className="bg-white px-4 pb-3 -mt-1 rounded-b-2xl border-t-0">
                        <span className="text-xs text-green-600 font-medium">
                          📍 {property.distanceKm} km away
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg font-medium">
                  No properties found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Google Map */}
        <div className="hidden lg:block flex-1">
          <PropertyMap
            properties={properties}
            onBoundsChanged={handleBoundsSearch}
            selectedPropertyId={selectedPropertyId}
            onPropertySelect={setSelectedPropertyId}
            center={radiusCenter}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayProp;
