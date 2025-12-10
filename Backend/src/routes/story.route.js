import express from "express";
import { 
  createStory, 
  getStories, 
  deleteStory 
} from "../controllers/story.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { storyUpload } from "../middlewares/multer.middleware.js"; // Use story-specific upload

const router = express.Router();

// Proper RESTful routing
router.route("/")
  .post(verifyJWT, storyUpload.single("media"), createStory) // POST /api/stories
  .get(getStories); // GET /api/stories

router.route("/:id")
  .delete(verifyJWT, deleteStory); // DELETE /api/stories/:id

export default router;