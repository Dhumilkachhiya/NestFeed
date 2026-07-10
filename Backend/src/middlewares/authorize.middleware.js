/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Usage in routes:
 *   import { authorizeRoles } from "../middlewares/authorize.middleware.js";
 *   router.post("/addproperty", verifyJWT, authorizeRoles("Seller", "Admin"), controller);
 *
 * Must be used AFTER verifyJWT (which sets req.user).
 * Checks if the authenticated user's role is in the allowed list.
 */
import { ApiErrors } from "../utils/ApiErrors.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiErrors(401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiErrors(
        403,
        `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

export { authorizeRoles };
