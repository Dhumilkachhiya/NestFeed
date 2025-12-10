import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiErrors } from "../utils/ApiErrors.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log("Cookies received in request:", req.cookies);
  console.log("Authorization header:", req.headers.authorization);

  let token = req.cookies?.accessToken || req.headers.authorization;

  if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Extract only the token
  }

  console.log("Extracted Token:", token);

  if (!token) {
    console.error("JWT Error: No token found");
    throw new ApiErrors(401, "Unauthorized request");
  }

  console.log("Extracted Token:", token); // Log the extracted token

  if (!token) {
    throw new ApiErrors(400, "Unauthorized request");
  }
  console.log("JWT Secret Key:", process.env.ACCESS_TOKEN_SECRET); // Debugging line
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded Token:", decodedToken); // Log decoded token

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiErrors(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid access token");
  }
});
