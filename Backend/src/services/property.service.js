/**
 * PropertyService — handles property CRUD, geospatial search,
 * and advanced filtering using MongoDB 2dsphere indexes.
 */
import { Property } from "../models/property.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";

class PropertyService {
  /**
   * Create a new property listing with optimized images.
   */
  async createProperty(userId, propertyData, imageFiles) {
    if (!imageFiles || imageFiles.length === 0) {
      throw new ApiErrors(400, "Upload at least one image");
    }

    const imageUrls = [];
    for (const file of imageFiles) {
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 1000, height: 1000, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imageUrls.push(cloudResponse.secure_url);
    }

    // Build coordinates from lat/lng if provided
    const coordinates =
      propertyData.latitude && propertyData.longitude
        ? {
            type: "Point",
            coordinates: [propertyData.longitude, propertyData.latitude],
          }
        : { type: "Point", coordinates: [0, 0] };

    const property = await Property.create({
      user: userId,
      title: propertyData.title,
      description: propertyData.description,
      price: propertyData.price,
      location: propertyData.location,
      coordinates,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      status: propertyData.status,
      furnished: propertyData.furnished,
      parking: propertyData.parking,
      propertyType: propertyData.propertyType,
      images: imageUrls,
    });

    return property;
  }

  /**
   * Get all properties (no filters).
   */
  async getAllProperties() {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email profilePicture");
    return properties;
  }

  /**
   * Get a single property by ID.
   */
  async getPropertyById(propertyId) {
    const property = await Property.findById(propertyId).populate(
      "user",
      "username email profilePicture"
    );
    if (!property) throw new ApiErrors(404, "Property not found");
    return property;
  }

  // ─── Geospatial Search Methods ─────────────────────────

  /**
   * Build a MongoDB filter object from optional query params.
   * Shared between bounds and radius search.
   */
  _buildFilterQuery(filters) {
    const query = {};

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    if (filters.bedrooms !== undefined) {
      query.bedrooms = { $gte: filters.bedrooms };
    }

    if (filters.status) query.status = filters.status;
    if (filters.propertyType) query.propertyType = filters.propertyType;
    if (filters.furnished) query.furnished = filters.furnished;
    if (filters.parking !== undefined) query.parking = filters.parking;

    return query;
  }

  /**
   * Search by Map Bounds — "Search This Area"
   * Uses $geoWithin + $box to find properties inside the visible map rectangle.
   *
   * @param {Object} bounds - { swLat, swLng, neLat, neLng }
   * @param {Object} filters - optional price/bedroom/status filters
   */
  async searchByBounds(bounds, filters = {}) {
    const filterQuery = this._buildFilterQuery(filters);

    const properties = await Property.find({
      ...filterQuery,
      coordinates: {
        $geoWithin: {
          $box: [
            [bounds.swLng, bounds.swLat], // Southwest [lng, lat]
            [bounds.neLng, bounds.neLat], // Northeast [lng, lat]
          ],
        },
      },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username email profilePicture")
      .limit(100); // Cap results for performance

    return properties;
  }

  /**
   * Search by Radius — "Properties near DA-IICT"
   * Uses $geoNear aggregation to find properties within a given radius
   * and returns the distance from the center point.
   *
   * @param {Object} center - { lat, lng }
   * @param {Number} radiusKm - search radius in kilometers
   * @param {Object} filters - optional filters
   */
  async searchByRadius(center, radiusKm = 5, filters = {}) {
    const filterQuery = this._buildFilterQuery(filters);
    const radiusInMeters = radiusKm * 1000;

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [center.lng, center.lat],
          },
          distanceField: "distance", // Distance in meters
          maxDistance: radiusInMeters,
          spherical: true,
          query: filterQuery,
        },
      },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 1] },
        },
      },
      { $sort: { distance: 1 } },
      { $limit: 100 },
    ];

    const properties = await Property.aggregate(pipeline);

    // Manually populate the user field after aggregation
    await Property.populate(properties, {
      path: "user",
      select: "username email profilePicture",
    });

    return properties;
  }

  /**
   * Advanced filtered search (no geo, just filters).
   * Used as fallback when no coordinates are provided.
   */
  async searchWithFilters(filters = {}) {
    const query = this._buildFilterQuery(filters);

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "username email profilePicture")
      .limit(100);

    return properties;
  }
}

export default new PropertyService();
