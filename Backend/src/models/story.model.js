import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true }, // Cloudinary URL
  expiresAt: { type: Date, default: Date.now() + 24 * 60 * 60 * 1000 }, // 24h expiry
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

// Auto-delete expired stories
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.model("Story", StorySchema);