import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addCommentSchema } from "../validations/post.validation.js";
import {
  addNewPost,
  getAllPostOnFeed,
  getUserPost,
  likePost,
  disLikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  savedPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(verifyJWT, upload.single("image"), addNewPost);
router.route("/all").get(verifyJWT, getAllPostOnFeed);
router.route("/userpost/getpost").get(verifyJWT, getUserPost);
router.route("/:id/like").get(verifyJWT, likePost);
router.route("/:id/dislike").get(verifyJWT, disLikePost);
router.route("/:id/comment").post(verifyJWT, validate(addCommentSchema), addComment);
router.route("/:id/comment/all").get(verifyJWT, getCommentsOfPost);
router.route("/delete/:id").delete(verifyJWT, deletePost);
router.route("/:id/save").get(verifyJWT, savedPost);

export default router;
