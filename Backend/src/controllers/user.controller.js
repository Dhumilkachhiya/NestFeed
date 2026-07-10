/**
 * User Controller — thin HTTP layer.
 * All business logic lives in AuthService and UserService.
 */
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AuthService from "../services/auth.service.js";
import UserService from "../services/user.service.js";

// ─── Auth ──────────────────────────────────────────────

const register = asyncHandler(async (req, res) => {
  const createdUser = await AuthService.register(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(200, { user, accessToken, refreshToken }, "User logged in successfully")
    );
});

const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user._id);

  const cookieOptions = { httpOnly: true };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// ─── Profile ───────────────────────────────────────────

const getProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getProfile(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const editProfile = asyncHandler(async (req, res) => {
  const user = await UserService.editProfile(
    req.user._id,
    req.body,
    req.file
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated"));
});

// ─── Discovery ─────────────────────────────────────────

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getSuggestedUsers(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Suggested users fetched"));
});

// ─── Social ────────────────────────────────────────────

const followOrUnfollow = asyncHandler(async (req, res) => {
  const result = await UserService.toggleFollow(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, `${result.action} successfully`));
});

export {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
};
