import mongoose from "mongoose";

// backend/models/post.model.js → backend/models/property.model.js
const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  bedrooms: Number,
  bathrooms: Number,
  images: [String], // Multiple images
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["For Sale", "Sold", "Rent"] },
  createdAt: { type: Date, default: Date.now },
},{timestamps:true});

export const Property = mongoose.model("Property", propertySchema);
