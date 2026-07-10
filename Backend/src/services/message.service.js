/**
 * MessageService — handles conversation and message logic.
 */
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

class MessageService {
  /**
   * Send a message. Creates a conversation if one doesn't exist.
   * @returns The created message document.
   */
  async sendMessage(senderId, receiverId, messageText) {
    let conversation = await Conversation.findOne({
      partcipants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        partcipants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: messageText,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    return newMessage;
  }

  /**
   * Get all messages in a conversation between two users.
   * @returns Array of message documents.
   */
  async getMessages(senderId, receiverId) {
    const conversation = await Conversation.findOne({
      partcipants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) return [];
    return conversation.messages;
  }
}

export default new MessageService();
