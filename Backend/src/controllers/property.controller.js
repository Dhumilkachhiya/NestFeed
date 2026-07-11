/**
 * Property Controller — thin HTTP layer.
 * Handles CRUD and geospatial search endpoints.
 */
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PropertyService from "../services/property.service.js";

const createProperty = asyncHandler(async (req, res) => {
  const property = await PropertyService.createProperty(
    req.user._id,
    req.body,
    req.files
  );

  return res
    .status(201)
    .json(new ApiResponse(201, property, "Property added"));
});

const getProperties = asyncHandler(async (req, res) => {
  const properties = await PropertyService.getAllProperties();

  return res
    .status(200)
    .json(new ApiResponse(200, properties, "Properties fetched successfully"));
});

const getPropertyById = asyncHandler(async (req, res) => {
  const property = await PropertyService.getPropertyById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property fetched successfully"));
});

// ─── Geospatial Search ─────────────────────────────────

/**
 * GET /api/v1/property/search/bounds
 * Search properties within the current map viewport.
 * Query: swLat, swLng, neLat, neLng + optional filters
 */
const searchByBounds = asyncHandler(async (req, res) => {
  const { swLat, swLng, neLat, neLng, ...filters } = req.body;

  const properties = await PropertyService.searchByBounds(
    { swLat, swLng, neLat, neLng },
    filters
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { properties, count: properties.length },
        "Properties in bounds fetched"
      )
    );
});

/**
 * GET /api/v1/property/search/radius
 * Search properties within a radius of a point (landmark).
 * Query: lat, lng, radius (km) + optional filters
 */
const searchByRadius = asyncHandler(async (req, res) => {
  const { lat, lng, radius, ...filters } = req.body;

  const properties = await PropertyService.searchByRadius(
    { lat, lng },
    radius,
    filters
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { properties, count: properties.length },
        "Nearby properties fetched"
      )
    );
});

/**
 * POST /api/v1/property/search/filter
 * Search properties using only filters (no geospatial).
 */
const searchWithFilters = asyncHandler(async (req, res) => {
  const properties = await PropertyService.searchWithFilters(req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { properties, count: properties.length },
        "Filtered properties fetched"
      )
    );
});

export {
  createProperty,
  getProperties,
  getPropertyById,
  searchByBounds,
  searchByRadius,
  searchWithFilters,
};