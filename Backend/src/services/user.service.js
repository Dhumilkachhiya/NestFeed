/**
 * UserService — handles user profile, follow/unfollow, and discovery logic.
 */
import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

class UserService {
  /**
   * Get a user's public profile by ID.
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new ApiErrors(404, "User not found");
    return user;
  }

  /**
   * Update a user's own profile (bio, gender, profile picture).
   */
  async editProfile(userId, { bio, gender }, profilePictureFile) {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new ApiErrors(404, "User not found");

    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender;

    if (profilePictureFile) {
      const fileUri = getDataUri(profilePictureFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();
    return user;
  }

  /**
   * Get suggested users (everyone except the current user).
   */
  async getSuggestedUsers(currentUserId) {
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password -refreshToken"
    );
    return users;
  }

  /**
   * Toggle follow/unfollow between two users.
   * @returns { action: "followed" | "unfollowed" }
   */
  async toggleFollow(myId, targetId) {
    if (myId.toString() === targetId.toString()) {
      throw new ApiErrors(400, "You cannot follow yourself");
    }

    const [user, targetUser] = await Promise.all([
      User.findById(myId),
      User.findById(targetId),
    ]);

    if (!user || !targetUser) {
      throw new ApiErrors(404, "User not found");
    }

    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: myId }, { $pull: { following: targetId } }),
        User.updateOne({ _id: targetId }, { $pull: { followers: myId } }),
      ]);
      return { action: "unfollowed" };
    } else {
      await Promise.all([
        User.updateOne({ _id: myId }, { $push: { following: targetId } }),
        User.updateOne({ _id: targetId }, { $push: { followers: myId } }),
      ]);
      return { action: "followed" };
    }
  }
}

export default new UserService();
