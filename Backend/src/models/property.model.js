import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    // Human-readable location string (e.g., "Near DA-IICT, Gandhinagar")
    location: {
      type: String,
      required: true,
      trim: true,
    },
    // GeoJSON Point for geospatial queries
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude] — GeoJSON standard
        default: [0, 0],
      },
    },
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number, // in sqft
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["For Sale", "Sold", "Rent"],
      default: "For Sale",
    },
    furnished: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      default: "Unfurnished",
    },
    parking: {
      type: Boolean,
      default: false,
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Plot", "House", "Commercial", "Other"],
      default: "Apartment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 2dsphere index enables $geoNear, $geoWithin queries
propertySchema.index({ coordinates: "2dsphere" });

// Compound text index for text search
propertySchema.index({ title: "text", description: "text", location: "text" });

// Price + status index for filtered searches
propertySchema.index({ price: 1, status: 1 });

export const Property = mongoose.model("Property", propertySchema);
