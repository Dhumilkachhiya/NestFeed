import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";
import {
  registerSchema,
  loginSchema,
  editProfileSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

// Public routes
router.route("/register").post(validate(registerSchema), register);
router.route("/login").post(validate(loginSchema), login);

// Authenticated routes
router.route("/logout").get(verifyJWT, logout);
router.route("/:id/profile").get(verifyJWT, getProfile);
router.route("/profile/edit").post(verifyJWT, uploadSingle, validate(editProfileSchema), editProfile);
router.route("/suggested").get(verifyJWT, getSuggestedUsers);
router.route("/followOrUnfollow/:id").post(verifyJWT, followOrUnfollow);

export default router;
