import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
} from "../controllers/property.controller.js";
import uploadMiddleware from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPropertySchema } from "../validations/property.validation.js";

const router = express.Router();

// Public route — anyone can browse properties
router.route("/getproperty").get(getProperties);
router.route("/:id").get(getPropertyById);

// Protected route — only Sellers and Admins can create listings
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
