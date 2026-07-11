import { z } from "zod";

// ─── Create Property ───────────────────────────────────
const createPropertySchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be at most 150 characters")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .default(""),
  price: z.coerce
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),
  location: z
    .string({ required_error: "Location is required" })
    .min(2, "Location must be at least 2 characters")
    .trim(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  bedrooms: z.coerce
    .number()
    .int("Bedrooms must be a whole number")
    .min(0)
    .optional()
    .default(0),
  bathrooms: z.coerce
    .number()
    .int("Bathrooms must be a whole number")
    .min(0)
    .optional()
    .default(0),
  area: z.coerce
    .number()
    .positive("Area must be a positive number")
    .optional(),
  status: z
    .enum(["For Sale", "Sold", "Rent"], {
      errorMap: () => ({ message: "Status must be For Sale, Sold, or Rent" }),
    })
    .optional()
    .default("For Sale"),
  furnished: z
    .enum(["Furnished", "Semi-Furnished", "Unfurnished"])
    .optional()
    .default("Unfurnished"),
  parking: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional()
    .default(false),
  propertyType: z
    .enum(["Apartment", "Villa", "Plot", "House", "Commercial", "Other"])
    .optional()
    .default("Apartment"),
});

// ─── Geospatial Search (Map Bounds) ────────────────────
// Used when the user drags the map — "Search This Area"
const searchBoundsSchema = z.object({
  // Southwest corner
  swLat: z.coerce.number().min(-90).max(90),
  swLng: z.coerce.number().min(-180).max(180),
  // Northeast corner
  neLat: z.coerce.number().min(-90).max(90),
  neLng: z.coerce.number().min(-180).max(180),
  // Optional filters
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  status: z.enum(["For Sale", "Sold", "Rent"]).optional(),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "House", "Commercial", "Other"]).optional(),
  furnished: z.enum(["Furnished", "Semi-Furnished", "Unfurnished"]).optional(),
  parking: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional(),
});

// ─── Radius Search (Near a Landmark) ───────────────────
// Used when the user searches "Near DA-IICT" or uses radius slider
const searchRadiusSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().default(5), // km
  // Optional filters
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  status: z.enum(["For Sale", "Sold", "Rent"]).optional(),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "House", "Commercial", "Other"]).optional(),
  furnished: z.enum(["Furnished", "Semi-Furnished", "Unfurnished"]).optional(),
  parking: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional(),
});

export { createPropertySchema, searchBoundsSchema, searchRadiusSchema };
