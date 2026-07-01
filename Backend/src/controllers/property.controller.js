import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";

// backend/controllers/post.controller.js → backend/controllers/property.controller.js
import { Property } from'../models/property.model.js';

// Create Property
const createProperty = asyncHandler(async (req, res) => {
  const { title, price, location, bedrooms, bathrooms, area, description } = req.body;
  
  // Ensure images are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Upload at least one image' });
  }

  // const images = req.files.map(file => file.path);

  let imageUrls = [];

  // Process each image
  for (const file of req.files) {
    try {
      // Optimize image using Sharp
      const optimizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 1000, height: 1000, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      // Convert to Base64 Data URI
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

      // Upload to Cloudinary
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imageUrls.push(cloudResponse.secure_url);
    } catch (error) {
      throw new ApiErrors(500, "Image processing/upload failed: " + error.message);
    }
  }

  const property = await Property.create({
    user: req.user._id,
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    description,
    images:imageUrls
  });

  res.status(201).json(
    new ApiResponse(201,property,"Property added")
    )
});

// Get All Properties
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find().populate('user', 'name email');
  res.status(200).json(new ApiResponse(200, properties, "Properties fetched successfully"));
});


export {createProperty,getProperties} 