import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sendMessageSchema } from "../validations/message.validation.js";
import { sendMessage, getMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(verifyJWT, validate(sendMessageSchema), sendMessage);
router.route("/get/:id").get(verifyJWT, getMessage);

export default router;
