import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.id;
  const receiverId = req.params.id;
  const { message } = req.body;

  let conversation = await Conversation.findOne({
    partcipants: { $all: [senderId, receiverId] },
  });

  // Establish conversation if not started yet
  if (!conversation) {
    conversation = await Conversation.create({
      partcipants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);

  // Implement socket.io for real time data transfer

  return res.status(200).json(new ApiResponse(201, newMessage, ""));
});

const getMessage =  asyncHandler ( async (req,res) =>{
    const senderId = req.id
    const receiverId = req.params.id
    const conversation = await Conversation.findOne({
        partcipants:{$all:[senderId,receiverId]}
    }).populate('messages')

    if (!conversation) {
        return res.status(200).json(
            new ApiResponse(201, { messages: [] }, "")
        )
    }

    return res.status(200).json(
        new ApiResponse(201,{messages:conversation?.messages},"")
    )
}) 

export { sendMessage, getMessage };
