import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "driver"], required: true },
  text: { type: String },
  image: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  user: { type: String, required: true },
  driver: { type: String, required: true },
  messages: [messageSchema],
});

export default mongoose.model("Conversation", conversationSchema);
