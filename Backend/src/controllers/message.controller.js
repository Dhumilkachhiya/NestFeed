/**
 * Message Controller — thin HTTP layer.
 * Business logic lives in MessageService.
 * Socket.io emission stays here since it's transport-layer infrastructure.
 */
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import MessageService from "../services/message.service.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const newMessage = await MessageService.sendMessage(
    req.user._id,
    req.params.id,
    req.body.message
  );

  // Real-time delivery via Socket.io
  const receiverSocketId = getReceiverSocketId(req.params.id);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent"));
});

const getMessage = asyncHandler(async (req, res) => {
  const messages = await MessageService.getMessages(
    req.user._id,
    req.params.id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { messages }, "Messages fetched"));
});

export { sendMessage, getMessage };
