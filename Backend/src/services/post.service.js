/**
 * PostService — handles feed posts, likes, comments, and bookmarks.
 */
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";

class PostService {
  /**
   * Create a new post with an optimized image.
   */
  async createPost(authorId, caption, imageFile) {
    if (!imageFile || !imageFile.buffer) {
      throw new ApiErrors(400, "Image is required");
    }

    // Optimize image
    const optimizedBuffer = await sharp(imageFile.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption: caption || "",
      image: cloudResponse.secure_url,
      author: authorId,
    });

    // Add post reference to the user
    await User.findByIdAndUpdate(authorId, { $push: { post: post._id } });

    await post.populate({ path: "author", select: "-password -refreshToken" });
    return post;
  }

  /**
   * Get all posts for the feed, sorted by newest first.
   */
  async getAllPosts() {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" },
      });
    return posts;
  }

  /**
   * Get all posts by a specific user.
   */
  async getUserPosts(authorId) {
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" },
      });
    return posts;
  }

  /**
   * Like a post (idempotent via $addToSet).
   */
  async likePost(userId, postId) {
    const post = await Post.findById(postId);
    if (!post) throw new ApiErrors(404, "Post not found");

    await post.updateOne({ $addToSet: { likes: userId } });
  }

  /**
   * Unlike a post.
   */
  async unlikePost(userId, postId) {
    const post = await Post.findById(postId);
    if (!post) throw new ApiErrors(404, "Post not found");

    await post.updateOne({ $pull: { likes: userId } });
  }

  /**
   * Add a comment to a post.
   * @returns The populated comment.
   */
  async addComment(userId, postId, text) {
    const post = await Post.findById(postId);
    if (!post) throw new ApiErrors(404, "Post not found");

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await comment.populate({ path: "author", select: "username profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    return comment;
  }

  /**
   * Get all comments for a post.
   */
  async getComments(postId) {
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");
    return comments;
  }

  /**
   * Delete a post and clean up references.
   */
  async deletePost(userId, postId) {
    const post = await Post.findById(postId);
    if (!post) throw new ApiErrors(404, "Post not found");

    if (post.author.toString() !== userId.toString()) {
      throw new ApiErrors(403, "You can only delete your own posts");
    }

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(userId, { $pull: { post: postId } });
    await Comment.deleteMany({ post: postId });
  }

  /**
   * Toggle bookmark/save on a post.
   * @returns { action: "saved" | "unsaved" }
   */
  async toggleBookmark(userId, postId) {
    const post = await Post.findById(postId);
    if (!post) throw new ApiErrors(404, "Post not found");

    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(post._id);

    if (isBookmarked) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      return { action: "unsaved" };
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      return { action: "saved" };
    }
  }
}

export default new PostService();
