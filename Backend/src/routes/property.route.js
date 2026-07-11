import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  searchByBounds,
  searchByRadius,
  searchWithFilters,
} from "../controllers/property.controller.js";
import uploadMiddleware from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createPropertySchema,
  searchBoundsSchema,
  searchRadiusSchema,
} from "../validations/property.validation.js";

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────

// Browse all properties
router.route("/getproperty").get(getProperties);

// Get a single property
router.route("/detail/:id").get(getPropertyById);

// ─── Geospatial Search Routes ──────────────────────────

// Search by visible map area (bounds)
router
  .route("/search/bounds")
  .post(validate(searchBoundsSchema), searchByBounds);

// Search by radius around a point (landmark)
router
  .route("/search/radius")
  .post(validate(searchRadiusSchema), searchByRadius);

// Search with filters only (no geo)
router.route("/search/filter").post(searchWithFilters);

// ─── Protected Routes ──────────────────────────────────

// Only Sellers and Admins can create listings
router
  .route("/addproperty")
  .post(
    verifyJWT,
    authorizeRoles("Seller", "Admin"),
    uploadMiddleware.array("images", 10),
    validate(createPropertySchema),
    createProperty
  );

export default router;
