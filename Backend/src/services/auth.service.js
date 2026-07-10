/**
 * AuthService — handles all authentication and token business logic.
 *
 * Controllers call these methods and format the HTTP response.
 * This service is framework-agnostic (no req/res) and can be
 * reused from background jobs, tests, or other services.
 */
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";

class AuthService {
  /**
   * Generate access + refresh tokens and persist the refresh token.
   */
  async generateTokenPair(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiErrors(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user account.
   * @returns The created user (without password).
   */
  async register({ username, email, password, role }) {
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiErrors(409, "Email already in use");
    }

    const existedUsername = await User.findOne({ username });
    if (existedUsername) {
      throw new ApiErrors(409, "Username already taken");
    }

    const user = await User.create({ username, email, password, role });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiErrors(500, "Something went wrong while registering user");
    }

    return createdUser;
  }

  /**
   * Authenticate a user with email + password.
   * @returns { user, accessToken, refreshToken }
   */
  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiErrors(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiErrors(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user._id);

    // Populate posts for the user payload
    const populatedPosts = await Promise.all(
      (user.post || []).map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(user._id)) return post;
        return null;
      })
    );

    const loggedInUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: populatedPosts.filter(Boolean),
    };

    return { user: loggedInUser, accessToken, refreshToken };
  }

  /**
   * Invalidate refresh token on logout.
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }
}

export default new AuthService();
