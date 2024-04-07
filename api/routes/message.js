const mongoose = require("mongoose");
const Message = require("../models/message");
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Chat = require("../models/chat");
const { verifytoken } = require("../middleware/check-auth");

router.post("/send", verifytoken, async (req, res) => {
  const { content, chatid, receiver } = req.body;
  if (!content || !chatid) {
    res.status(400).json({ message: "error send message" });
  } else {
    var newmessage = new Message({
      sender: req.user.id,
      receiver: receiver,
      content: content,
      chat: chatid,
    });
    try {
      await newmessage.save();
      newmessage = await newmessage.populate({
        path: "sender",
        select: "-password",
      });
      newmessage = await newmessage.populate({ path: "chat" });
      newmessage = await User.populate(newmessage, {
        path: "chat.users",
        select: "name profile",
      });
      await Chat.findByIdAndUpdate(chatid, { latestmessage: newmessage._id });
      res.status(201).json({ status: "success", message: newmessage });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
});

router.get("/:id", verifytoken, async (req, res) => {
  const pagesize = 12;
  const pages = req.query.pages || 1;
  const skipmessages = (pages - 1) * pagesize;
  try {
    var messages = await Message.find({ chat: req.params.id })
      .populate({ path: "sender", select: "-password" })
      .populate({
        path: "chat",
        strictPopulate: false,
        populate: { path: "users", select: "name" },
      })
      .sort({ createdAt: -1 })
      .skip(skipmessages)
      .limit(pagesize);
    messages = await User.populate(messages, {
      path: "chat.users",
      select: "name profile",
    });
    res.json({ status: "success", messages: messages });
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
