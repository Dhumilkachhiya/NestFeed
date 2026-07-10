import { z } from "zod";

const sendMessageSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be at most 2000 characters")
    .trim(),
});

export { sendMessageSchema };
