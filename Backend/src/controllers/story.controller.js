import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Story
export const createStory = asyncHandler(async (req, res) => {
  console.log("Received file:", req.file); // ✅ Debugging
  if (!req.file) {
    return res.status(400).json({ message: "No media uploaded" });
  }
  // Convert buffer to base64 for Cloudinary
  try {
    const b64 = Buffer.from(req.file.buffer || "").toString("base64"); // Avoid undefined
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      // ✅ Use buffer
      folder: "stories",
      resource_type: "auto",
    });

    const story = await Story.create({
      user: req.user._id,
      content: result.secure_url,
    });

    // Add story to user's stories array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { stories: story._id },
    });

    res.status(201).json(new ApiResponse(201, story, "Story created successfully"));
  } catch (err) {
    console.error("Upload Error:", err); // ✅ Log Cloudinary or other errors
    res
      .status(500)
      .json({ success: false, error: err.message || "Upload failed" });
  }
});

// Get All Stories (for carousel)
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "username profilePicture")
      .sort("-createdAt");

    res.status(200).json(new ApiResponse(200, stories, "Stories fetched successfully"));
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories" });
  }
};

// Delete Story
export const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Story ID format" });
  }

  console.log("Deleting Story ID:", id);

  const story = await Story.findById(id);

  if (!story) throw new Error("Story not found");

  if (story.user.toString() !== req.user._id.toString()) {
    throw new Error("Not authorized");
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(
    story.content.split("/").pop().split(".")[0]
  );

  await story.deleteOne();
  res.status(200).json({ success: true });
});
