import { z } from "zod";

const addCommentSchema = z.object({
  text: z
    .string({ required_error: "Comment text is required" })
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be at most 500 characters")
    .trim(),
});

const createPostSchema = z.object({
  caption: z.string().max(2200, "Caption must be at most 2200 characters").optional().default(""),
});

export { addCommentSchema, createPostSchema };
