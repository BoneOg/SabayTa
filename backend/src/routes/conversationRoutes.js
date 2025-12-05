import express from "express";
import Conversation from "../models/Conversation.js";

const router = express.Router();

// Get conversation between user and driver
router.get("/", async (req, res) => {
  const { user, driver } = req.query;
  try {
    let convo = await Conversation.findOne({ user, driver });
    if (!convo) {
      convo = await Conversation.create({ user, driver, messages: [] });
    }
    res.json(convo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a message
router.post("/message", async (req, res) => {
  const { user, driver, sender, text, image } = req.body;
  try {
    let convo = await Conversation.findOne({ user, driver });
    if (!convo) {
      convo = await Conversation.create({ user, driver, messages: [] });
    }

    const newMessage = { sender, text, image, timestamp: new Date() };
    convo.messages.push(newMessage);
    await convo.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
