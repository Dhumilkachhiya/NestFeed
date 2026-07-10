/**
 * Zod Validation Middleware
 *
 * Usage in routes:
 *   import { validate } from "../middlewares/validate.middleware.js";
 *   import { registerSchema } from "../validations/auth.validation.js";
 *   router.post("/register", validate(registerSchema), controller);
 *
 * Validates req.body against a Zod schema. Returns 400 with structured
 * error details on failure. Passes control to the next middleware on success.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Replace req.body with the parsed (and coerced/transformed) data
  req.body = result.data;
  next();
};

export { validate };
