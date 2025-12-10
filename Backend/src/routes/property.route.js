// backend/routes/post.route.js → backend/routes/property.route.js
import express from "express";
import { createProperty, getProperties } from "../controllers/property.controller.js";
import uploadMiddleware from "../middlewares/multer.middleware.js"; // For image uploads
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/addproperty").post(verifyJWT,uploadMiddleware.array("images", 10), createProperty);
router.route("/getproperty").get(getProperties);

export default router
