import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage, getMessage } from "..//controllers/message.controller.js"


const router =  express.Router()

router.route("/send/:id").post(verifyJWT,sendMessage)
router.route("/get/:id").get(verifyJWT,getMessage)

export default router

