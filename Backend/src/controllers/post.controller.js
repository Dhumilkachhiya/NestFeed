/**
 * Post Controller — thin HTTP layer.
 * All business logic lives in PostService.
 */
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PostService from "../services/post.service.js";

const addNewPost = asyncHandler(async (req, res) => {
  const post = await PostService.createPost(req.user._id, req.body.caption, req.file);

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "New post added"));
});

const getAllPostOnFeed = asyncHandler(async (req, res) => {
  const posts = await PostService.getAllPosts();

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getUserPost = asyncHandler(async (req, res) => {
  const posts = await PostService.getUserPosts(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "All user's posts fetched"));
});

const likePost = asyncHandler(async (req, res) => {
  await PostService.likePost(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post liked"));
});

const disLikePost = asyncHandler(async (req, res) => {
  await PostService.unlikePost(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post unliked"));
});

const addComment = asyncHandler(async (req, res) => {
  const comment = await PostService.addComment(
    req.user._id,
    req.params.id,
    req.body.text
  );

  return res
    .status(201)
    .json(new ApiResponse(201, { comment }, "Comment published"));
});

const getCommentsOfPost = asyncHandler(async (req, res) => {
  const comments = await PostService.getComments(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "All comments fetched"));
});

const deletePost = asyncHandler(async (req, res) => {
  await PostService.deletePost(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted"));
});

const savedPost = asyncHandler(async (req, res) => {
  const result = await PostService.toggleBookmark(req.user._id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, result.action === "saved" ? "Post saved" : "Post removed from saved"));
});

export {
  addNewPost,
  getAllPostOnFeed,
  getUserPost,
  likePost,
  disLikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  savedPost,
};
