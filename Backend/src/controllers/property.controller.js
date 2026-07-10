/**
 * Property Controller — thin HTTP layer.
 * All business logic lives in PropertyService.
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

export { createProperty, getProperties, getPropertyById };