import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiErrors } from "../utils/ApiErrors.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken || req.headers.authorization;

  if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    throw new ApiErrors(401, "Unauthorized request — no token provided");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiErrors(401, "Invalid access token — user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid access token");
  }
});
