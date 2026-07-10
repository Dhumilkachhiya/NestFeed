import { z } from "zod";

const createPropertySchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be at most 150 characters")
    .trim(),
  price: z.coerce
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),
  location: z
    .string({ required_error: "Location is required" })
    .min(2, "Location must be at least 2 characters")
    .trim(),
  bedrooms: z.coerce
    .number()
    .int("Bedrooms must be a whole number")
    .min(0)
    .optional(),
  bathrooms: z.coerce
    .number()
    .int("Bathrooms must be a whole number")
    .min(0)
    .optional(),
  area: z.coerce
    .number()
    .positive("Area must be a positive number")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  status: z
    .enum(["For Sale", "Sold", "Rent"], {
      errorMap: () => ({
        message: "Status must be For Sale, Sold, or Rent",
      }),
    })
    .optional()
    .default("For Sale"),
  // Geospatial coordinates (Phase 2, but schema-ready)
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export { createPropertySchema };
