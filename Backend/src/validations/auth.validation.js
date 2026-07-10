import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .trim()
    .toLowerCase(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["Buyer", "Seller"], {
      errorMap: () => ({ message: "Role must be Buyer or Seller" }),
    })
    .optional()
    .default("Buyer"),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" }),
});

const editProfileSchema = z.object({
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
  gender: z.enum(["male", "female"]).optional(),
});

export { registerSchema, loginSchema, editProfileSchema };
