import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
  userMessage: String,
  aiReply: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Chat = mongoose.model("Chat", chatSchema)