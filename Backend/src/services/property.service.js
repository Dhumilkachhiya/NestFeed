/**
 * PropertyService — handles property CRUD and will later
 * support geospatial search, filtering, and comparison.
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

    const property = await Property.create({
      user: userId,
      title: propertyData.title,
      price: propertyData.price,
      location: propertyData.location,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      description: propertyData.description,
      status: propertyData.status,
      images: imageUrls,
    });

    return property;
  }

  /**
   * Get all properties (basic, no filters yet).
   * Phase 2 will add geospatial + filter capabilities.
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
    const property = await Property.findById(propertyId)
      .populate("user", "username email profilePicture");
    if (!property) throw new ApiErrors(404, "Property not found");
    return property;
  }
}

export default new PropertyService();
